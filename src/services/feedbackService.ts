import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  query, 
  where, 
  orderBy, 
  limit, 
  updateDoc, 
  deleteDoc, 
  onSnapshot 
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType, auth } from '../lib/firebase';
import { ToolFeedback, FeedbackType } from '../types';

export interface SubmitFeedbackParams {
  toolId: string;
  toolName: string;
  rating: number;
  type: FeedbackType;
  comment: string;
  userId?: string;
  userEmail?: string;
  userName?: string;
}

/**
 * Submit tool rating, bug report, or improvement request to Firestore
 */
export async function submitToolFeedback(params: SubmitFeedbackParams): Promise<ToolFeedback> {
  const collectionPath = 'tool_feedback';
  const feedbackId = `fb_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
  const currentUser = auth.currentUser;
  
  const userId = currentUser?.uid || params.userId || 'guest';
  const userEmail = currentUser?.email || params.userEmail || (userId === 'guest' ? 'guest@toolstack.local' : '');
  const userName = currentUser?.displayName || params.userName || (userId === 'guest' ? 'Community Guest' : 'Anonymous Member');
  const nowIso = new Date().toISOString();

  // Sanitize and trim comment to declared blueprint constraint (1,000 chars)
  const sanitizedComment = (params.comment || '').trim().slice(0, 1000);
  const ratingClamped = Math.max(1, Math.min(5, Math.round(params.rating || 5)));

  const payload: ToolFeedback = {
    id: feedbackId,
    feedbackId,
    toolId: params.toolId,
    toolName: params.toolName.slice(0, 128),
    rating: ratingClamped,
    type: params.type,
    comment: sanitizedComment,
    userId,
    userEmail: userEmail.slice(0, 256),
    userName: userName.slice(0, 128),
    status: 'pending',
    createdAt: nowIso,
  };

  try {
    const docRef = doc(db, collectionPath, feedbackId);
    await setDoc(docRef, payload);
    return payload;
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('Missing or insufficient permissions') || (error as any)?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.CREATE, collectionPath);
    }
    console.warn('Could not submit feedback to remote database, operating in local fallback:', errorMsg);
    return payload;
  }
}

/**
 * Get feedback entries for a specific tool
 */
export async function getToolFeedback(toolId: string, maxEntries: number = 30): Promise<ToolFeedback[]> {
  const collectionPath = 'tool_feedback';
  try {
    const q = query(
      collection(db, collectionPath),
      where('toolId', '==', toolId),
      limit(maxEntries)
    );
    const snap = await getDocs(q);
    const list: ToolFeedback[] = [];
    snap.forEach((d) => {
      const data = d.data() as ToolFeedback;
      list.push({ ...data, id: d.id });
    });
    // Sort in memory by createdAt descending
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('Missing or insufficient permissions') || (error as any)?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
    console.warn('Could not fetch tool feedback from backend:', errorMsg);
    return [];
  }
}

/**
 * Subscribe to real-time feedback updates for a tool
 */
export function subscribeToToolFeedback(
  toolId: string, 
  callback: (feedbackList: ToolFeedback[]) => void,
  maxEntries: number = 25
): () => void {
  const collectionPath = 'tool_feedback';
  try {
    const q = query(
      collection(db, collectionPath),
      where('toolId', '==', toolId),
      limit(maxEntries)
    );
    return onSnapshot(
      q,
      (snapshot) => {
        const list: ToolFeedback[] = [];
        snapshot.forEach((d) => {
          const data = d.data() as ToolFeedback;
          list.push({ ...data, id: d.id });
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        callback(list);
      },
      (error) => {
        const errorMsg = error instanceof Error ? error.message : String(error);
        if (errorMsg.includes('Missing or insufficient permissions') || (error as any)?.code === 'permission-denied') {
          handleFirestoreError(error, OperationType.GET, collectionPath);
        } else {
          console.warn('Real-time feedback listener offline or reconnecting:', errorMsg);
          callback([]);
        }
      }
    );
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('Missing or insufficient permissions') || (error as any)?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
    console.warn('Feedback subscription initialization warning:', errorMsg);
    return () => {};
  }
}

/**
 * Get all feedback for admin dashboard
 */
export async function getAllFeedback(maxEntries: number = 100): Promise<ToolFeedback[]> {
  const collectionPath = 'tool_feedback';
  try {
    const q = query(collection(db, collectionPath), limit(maxEntries));
    const snap = await getDocs(q);
    const list: ToolFeedback[] = [];
    snap.forEach((d) => {
      const data = d.data() as ToolFeedback;
      list.push({ ...data, id: d.id });
    });
    return list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } catch (error) {
    const errorMsg = error instanceof Error ? error.message : String(error);
    if (errorMsg.includes('Missing or insufficient permissions') || (error as any)?.code === 'permission-denied') {
      handleFirestoreError(error, OperationType.GET, collectionPath);
    }
    console.warn('Could not fetch all feedback:', errorMsg);
    return [];
  }
}

/**
 * Update feedback status (reviewed, resolved, pending)
 */
export async function updateFeedbackStatus(
  feedbackId: string, 
  status: 'pending' | 'reviewed' | 'resolved'
): Promise<void> {
  const collectionPath = `tool_feedback/${feedbackId}`;
  try {
    const docRef = doc(db, 'tool_feedback', feedbackId);
    await updateDoc(docRef, { status });
  } catch (error) {
    handleFirestoreError(error, OperationType.UPDATE, collectionPath);
  }
}

/**
 * Delete a feedback item
 */
export async function deleteFeedbackItem(feedbackId: string): Promise<void> {
  const collectionPath = `tool_feedback/${feedbackId}`;
  try {
    const docRef = doc(db, 'tool_feedback', feedbackId);
    await deleteDoc(docRef);
  } catch (error) {
    handleFirestoreError(error, OperationType.DELETE, collectionPath);
  }
}
