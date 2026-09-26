import React, { createContext, useContext, useEffect, useState } from 'react';
import { 
  User, 
  onAuthStateChanged, 
  signInWithPopup, 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut as firebaseSignOut,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { 
  doc, 
  getDoc, 
  setDoc, 
  collection, 
  getDocs, 
  deleteDoc, 
  serverTimestamp 
} from 'firebase/firestore';
import { auth, db, googleProvider, handleFirestoreError, OperationType } from '../lib/firebase';
import { getFriendlyAuthErrorMessage } from '../utils/authErrors';
import { UserProfile, UserFavorite, ToolHistoryItem, SavedPreset, SiteSettings, AdminAuditLog } from '../types';

interface AuthContextType {
  currentUser: User | null;
  user: User | null;
  userProfile: UserProfile | null;
  profile: UserProfile | null;
  isAdmin: boolean;
  loading: boolean;
  error: string | null;
  clearError: () => void;
  favorites: UserFavorite[];
  history: ToolHistoryItem[];
  presets: SavedPreset[];
  siteSettings: SiteSettings;
  loginWithGoogle: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
  loginWithEmail: (email: string, pass: string) => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signupWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, name: string) => Promise<void>;
  sendPasswordReset: (email: string) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  logout: () => Promise<void>;
  signOutUser: () => Promise<void>;
  toggleFavorite: (toolId: string, toolName?: string) => Promise<void>;
  removeFavorite: (toolId: string) => Promise<void>;
  isFavorite: (toolId: string) => boolean;
  addHistoryItem: (toolId: string, toolName: string, summary: string) => Promise<void>;
  addHistory: (toolId: string, toolName: string, summary: string) => Promise<void>;
  savePreset: (toolId: string, name: string, presetData: string) => Promise<void>;
  deletePreset: (presetId: string) => Promise<void>;
  clearHistory: () => Promise<void>;
  updateSiteSettings: (settings: Partial<SiteSettings>) => Promise<void>;
  updateUserProfile: (data: Partial<UserProfile>) => Promise<void>;
  getAllUsers: () => Promise<UserProfile[]>;
  updateUserRole: (userId: string, role: 'admin' | 'user') => Promise<void>;
  updateUserStatus: (userId: string, status: 'active' | 'suspended') => Promise<void>;
  deleteUserAccount: (userId: string) => Promise<void>;
  createAdminUser: (email: string, displayName: string, role: 'admin' | 'user') => Promise<void>;
  getAdminLogs: (countLimit?: number) => Promise<AdminAuditLog[]>;
  logAdminAction: (action: string, details: string) => Promise<void>;
  clearAdminLogs: () => Promise<void>;
}

const defaultSiteSettings: SiteSettings = {
  announcement: 'Welcome to ToolStack! 50+ free, fast online tools with 100% browser-based privacy.',
  maintenanceMode: false,
  featuredTools: ['pdf-merge', 'image-compressor', 'json-formatter', 'emi-calculator', 'qr-generator', 'password-generator'],
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [favorites, setFavorites] = useState<UserFavorite[]>([]);
  const [history, setHistory] = useState<ToolHistoryItem[]>([]);
  const [presets, setPresets] = useState<SavedPreset[]>([]);
  const [siteSettings, setSiteSettings] = useState<SiteSettings>(defaultSiteSettings);
  const [error, setError] = useState<string | null>(null);

  const clearError = () => setError(null);

  // Sync auth state across sessions and page refreshes
  useEffect(() => {
    let isMounted = true;

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!isMounted) return;
      setCurrentUser(user);

      if (user) {
        // Load or create profile in Firestore
        try {
          const userDocRef = doc(db, 'users', user.uid);
          const snap = await getDoc(userDocRef);
          
          const cleanEmail = (user.email || '').trim().toLowerCase();
          const isBootstrapAdmin = cleanEmail === 'rajht203@gmail.com' && Boolean(user.emailVerified);
          const defaultRole: 'user' | 'admin' = isBootstrapAdmin ? 'admin' : 'user';

          if (!snap.exists()) {
            const newProfile: UserProfile = {
              userId: user.uid,
              email: cleanEmail,
              displayName: user.displayName || cleanEmail.split('@')[0] || 'User',
              photoURL: user.photoURL || undefined,
              role: defaultRole,
              status: 'active',
              createdAt: new Date().toISOString()
            };
            try {
              await setDoc(userDocRef, newProfile);
            } catch (writeErr) {
              console.warn('Could not write initial profile to Firestore:', writeErr);
            }
            if (isMounted) setUserProfile(newProfile);
          } else {
            const data = snap.data() as UserProfile;
            if (isBootstrapAdmin && data.role !== 'admin') {
              data.role = 'admin';
              try {
                await setDoc(userDocRef, { role: 'admin' }, { merge: true });
              } catch (e) {
                console.warn('Could not upgrade admin role in Firestore:', e);
              }
            }
            if (isMounted) setUserProfile(data);
          }

          // Fetch user subcollections
          if (isMounted) {
            await loadUserSubcollections(user.uid);
          }
        } catch (err) {
          console.warn('Profile sync warning (retaining local state):', err);
          if (isMounted) {
            const cleanEmail = (user.email || '').trim().toLowerCase();
            setUserProfile({
              userId: user.uid,
              email: cleanEmail,
              displayName: user.displayName || cleanEmail.split('@')[0] || 'User',
              photoURL: user.photoURL || undefined,
              role: (cleanEmail === 'rajht203@gmail.com' && Boolean(user.emailVerified)) ? 'admin' : 'user',
              status: 'active',
              createdAt: new Date().toISOString()
            });
            loadLocalData();
          }
        }
      } else {
        if (isMounted) {
          setUserProfile(null);
          loadLocalData();
        }
      }

      if (isMounted) {
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  // Fetch site settings
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const ref = doc(db, 'site_settings', 'global');
        const snap = await getDoc(ref);
        if (snap.exists()) {
          setSiteSettings(snap.data() as SiteSettings);
        }
      } catch (e) {
        // Use default settings
      }
    };
    fetchSettings();
  }, []);

  const loadUserSubcollections = async (uid: string) => {
    try {
      // Favorites
      const favSnap = await getDocs(collection(db, 'users', uid, 'favorites'));
      const favList: UserFavorite[] = [];
      favSnap.forEach((d) => favList.push(d.data() as UserFavorite));
      setFavorites(favList);

      // History
      const histSnap = await getDocs(collection(db, 'users', uid, 'history'));
      const histList: ToolHistoryItem[] = [];
      histSnap.forEach((d) => histList.push(d.data() as ToolHistoryItem));
      histList.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      setHistory(histList);

      // Presets
      const presetSnap = await getDocs(collection(db, 'users', uid, 'presets'));
      const presList: SavedPreset[] = [];
      presetSnap.forEach((d) => presList.push(d.data() as SavedPreset));
      setPresets(presList);
    } catch (e) {
      loadLocalData();
    }
  };

  const loadLocalData = () => {
    try {
      const localFav = localStorage.getItem('toolstack_favorites');
      if (localFav) setFavorites(JSON.parse(localFav));
      const localHist = localStorage.getItem('toolstack_history');
      if (localHist) setHistory(JSON.parse(localHist));
      const localPresets = localStorage.getItem('toolstack_presets');
      if (localPresets) setPresets(JSON.parse(localPresets));
    } catch (e) {
      // ignore
    }
  };

  const signInWithGoogle = async () => {
    setError(null);
    try {
      googleProvider.setCustomParameters({
        prompt: 'select_account'
      });
      const cred = await signInWithPopup(auth, googleProvider);
      if (cred.user) {
        setCurrentUser(cred.user);
      }
    } catch (err: any) {
      console.error('Google login error:', err);
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    try {
      const cred = await signInWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        setCurrentUser(cred.user);
      }
    } catch (err: any) {
      console.error('Email signin error:', err);
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signUpWithEmail = async (email: string, pass: string, name: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();
    try {
      const cred = await createUserWithEmailAndPassword(auth, cleanEmail, pass);
      if (cred.user) {
        // Set display name in Firebase Auth user record
        try {
          await updateProfile(cred.user, { displayName: cleanName });
        } catch (profileErr) {
          console.warn('Failed to update Auth user displayName:', profileErr);
        }

        const isBootstrap = cleanEmail === 'rajht203@gmail.com';
        const newProfile: UserProfile = {
          userId: cred.user.uid,
          email: cleanEmail,
          displayName: cleanName || cleanEmail.split('@')[0] || 'User',
          photoURL: cred.user.photoURL || undefined,
          role: isBootstrap ? 'admin' : 'user',
          status: 'active',
          createdAt: new Date().toISOString()
        };

        try {
          await setDoc(doc(db, 'users', cred.user.uid), newProfile);
        } catch (dbErr) {
          console.warn('Could not save profile in Firestore immediately:', dbErr);
        }

        setUserProfile(newProfile);
        setCurrentUser(cred.user);
      }
    } catch (err: any) {
      console.error('Email signup error:', err);
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const sendPasswordReset = async (email: string) => {
    setError(null);
    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail) {
      const msg = 'Please provide a valid email address.';
      setError(msg);
      throw new Error(msg);
    }
    try {
      await sendPasswordResetEmail(auth, cleanEmail);
    } catch (err: any) {
      console.error('Password reset error:', err);
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const signOutUser = async () => {
    setError(null);
    try {
      await firebaseSignOut(auth);
      setCurrentUser(null);
      setUserProfile(null);
      setFavorites([]);
      setHistory([]);
      setPresets([]);
      loadLocalData();
    } catch (err: any) {
      const msg = getFriendlyAuthErrorMessage(err);
      setError(msg);
      throw new Error(msg);
    }
  };

  const isFavorite = (toolId: string) => {
    return favorites.some(f => f.toolId === toolId);
  };

  const toggleFavorite = async (toolId: string, toolName?: string) => {
    const existing = favorites.find(f => f.toolId === toolId);
    if (existing) {
      const next = favorites.filter(f => f.toolId !== toolId);
      setFavorites(next);
      if (currentUser) {
        try {
          await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', toolId));
        } catch (e) {
          // ignore
        }
      } else {
        localStorage.setItem('toolstack_favorites', JSON.stringify(next));
      }
    } else {
      const newFav: UserFavorite = {
        id: toolId,
        userId: currentUser?.uid || 'guest',
        toolId,
        toolName: toolName || toolId,
        createdAt: new Date().toISOString()
      };
      const next = [...favorites, newFav];
      setFavorites(next);
      if (currentUser) {
        try {
          await setDoc(doc(db, 'users', currentUser.uid, 'favorites', toolId), newFav);
        } catch (e) {
          // ignore
        }
      } else {
        localStorage.setItem('toolstack_favorites', JSON.stringify(next));
      }
    }
  };

  const removeFavorite = async (toolId: string) => {
    const next = favorites.filter(f => f.toolId !== toolId);
    setFavorites(next);
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'favorites', toolId));
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.setItem('toolstack_favorites', JSON.stringify(next));
    }
  };

  const addHistoryItem = async (toolId: string, toolName: string, summary: string) => {
    const item: ToolHistoryItem = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      userId: currentUser?.uid || 'guest',
      toolId,
      toolName,
      summary,
      createdAt: new Date().toISOString()
    };
    const next = [item, ...(history || []).slice(0, 49)];
    setHistory(next);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'history', item.id), item);
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.setItem('toolstack_history', JSON.stringify(next));
    }
  };

  const addHistory = async (toolId: string, toolName: string, summary: string) => {
    return addHistoryItem(toolId, toolName, summary);
  };

  const savePreset = async (toolId: string, name: string, presetData: string) => {
    const preset: SavedPreset = {
      id: `preset-${Date.now()}`,
      userId: currentUser?.uid || 'guest',
      toolId,
      name,
      presetData,
      createdAt: new Date().toISOString()
    };
    const next = [...presets, preset];
    setPresets(next);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'users', currentUser.uid, 'presets', preset.id), preset);
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.setItem('toolstack_presets', JSON.stringify(next));
    }
  };

  const deletePreset = async (presetId: string) => {
    const next = presets.filter(p => p.id !== presetId);
    setPresets(next);
    if (currentUser) {
      try {
        await deleteDoc(doc(db, 'users', currentUser.uid, 'presets', presetId));
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.setItem('toolstack_presets', JSON.stringify(next));
    }
  };

  const clearHistory = async () => {
    setHistory([]);
    if (currentUser) {
      try {
        const histSnap = await getDocs(collection(db, 'users', currentUser.uid, 'history'));
        histSnap.forEach(async (d) => {
          await deleteDoc(d.ref);
        });
      } catch (e) {
        // ignore
      }
    } else {
      localStorage.removeItem('toolstack_history');
    }
  };

  const userCleanEmail = (currentUser?.email || '').trim().toLowerCase();
  const isOwnerAdmin = userCleanEmail === 'rajht203@gmail.com';
  const isRoleAdmin = userProfile?.role === 'admin' && userProfile?.status !== 'suspended';
  const isAdmin = Boolean(currentUser && (isOwnerAdmin || isRoleAdmin));

  const updateSiteSettings = async (settings: Partial<SiteSettings>) => {
    if (!isAdmin) {
      console.warn('Unauthorized updateSiteSettings attempt');
      return;
    }
    const updated = { ...siteSettings, ...settings, updatedAt: new Date().toISOString(), updatedBy: currentUser?.email || 'admin' };
    setSiteSettings(updated);
    if (currentUser) {
      try {
        await setDoc(doc(db, 'site_settings', 'global'), updated);
      } catch (e) {
        // ignore
      }
    }
  };

  const updateUserProfile = async (data: Partial<UserProfile>) => {
    if (!currentUser) return;
    const updated = { 
      ...(userProfile || {}), 
      ...data, 
      userId: currentUser.uid, 
      email: currentUser.email || '', 
      updatedAt: new Date().toISOString() 
    } as UserProfile;
    setUserProfile(updated);

    if (data.displayName && data.displayName.trim()) {
      try {
        await updateProfile(currentUser, { displayName: data.displayName.trim() });
      } catch (authErr) {
        console.warn('Auth user displayName update warning:', authErr);
      }
    }

    try {
      await setDoc(doc(db, 'users', currentUser.uid), updated, { merge: true });
    } catch (e) {
      console.warn('Profile update fallback:', e);
    }
  };

  const getAllUsers = async (): Promise<UserProfile[]> => {
    if (!isAdmin) {
      console.warn('Unauthorized getAllUsers attempt');
      return [];
    }
    const list: UserProfile[] = [];
    try {
      const snap = await getDocs(collection(db, 'users'));
      snap.forEach(d => {
        list.push(d.data() as UserProfile);
      });
    } catch (e) {
      console.warn('Could not list users from firestore:', e);
    }

    if (userProfile && !list.some(u => u.userId === userProfile.userId)) {
      list.unshift(userProfile);
    }

    return list;
  };

  const logAdminAction = async (action: string, details: string) => {
    if (!isAdmin) return;
    const logItem: AdminAuditLog = {
      id: `log-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      adminId: currentUser?.uid || 'system-admin',
      adminEmail: currentUser?.email || 'rajht203@gmail.com',
      action,
      details,
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'admin_logs', logItem.id), logItem);
    } catch (e) {
      // ignore
    }
  };

  const updateUserRole = async (userId: string, role: 'admin' | 'user') => {
    if (!isAdmin) {
      throw new Error('Access denied: Administrator permissions required.');
    }
    try {
      await setDoc(doc(db, 'users', userId), { role, updatedAt: new Date().toISOString() }, { merge: true });
      await logAdminAction('UPDATE_ROLE', `Changed user ${userId} role to ${role}`);
    } catch (e) {
      console.warn('Role update fallback:', e);
    }
  };

  const updateUserStatus = async (userId: string, status: 'active' | 'suspended') => {
    if (!isAdmin) {
      throw new Error('Access denied: Administrator permissions required.');
    }
    try {
      await setDoc(doc(db, 'users', userId), { status, updatedAt: new Date().toISOString() }, { merge: true });
      await logAdminAction('UPDATE_STATUS', `Set user ${userId} status to ${status}`);
    } catch (e) {
      console.warn('Status update fallback:', e);
    }
  };

  const deleteUserAccount = async (userId: string) => {
    if (!isAdmin) {
      throw new Error('Access denied: Administrator permissions required.');
    }
    try {
      await deleteDoc(doc(db, 'users', userId));
      await logAdminAction('DELETE_USER', `Deleted user account ${userId}`);
    } catch (e) {
      console.warn('Delete user fallback:', e);
    }
  };

  const createAdminUser = async (email: string, displayName: string, role: 'admin' | 'user') => {
    if (!isAdmin) {
      throw new Error('Access denied: Administrator permissions required.');
    }
    const newUid = `user-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const newDoc: UserProfile = {
      userId: newUid,
      email,
      displayName,
      role,
      status: 'active',
      createdAt: new Date().toISOString()
    };
    try {
      await setDoc(doc(db, 'users', newUid), newDoc);
      await logAdminAction('CREATE_USER', `Admin created user profile for ${email} with role ${role}`);
    } catch (e) {
      console.warn('Create user fallback:', e);
    }
  };

  const getAdminLogs = async (countLimit?: number): Promise<AdminAuditLog[]> => {
    if (!isAdmin) return [];
    let logs: AdminAuditLog[] = [];
    try {
      const snap = await getDocs(collection(db, 'admin_logs'));
      snap.forEach(d => logs.push(d.data() as AdminAuditLog));
      logs.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } catch (e) {
      console.warn('Get admin logs error:', e);
    }
    return countLimit ? logs.slice(0, countLimit) : logs;
  };

  const clearAdminLogs = async () => {
    if (!isAdmin) return;
    try {
      const snap = await getDocs(collection(db, 'admin_logs'));
      snap.forEach(async d => {
        await deleteDoc(d.ref);
      });
    } catch (e) {
      // ignore
    }
  };

  return (
    <AuthContext.Provider value={{
      currentUser,
      user: currentUser,
      userProfile,
      profile: userProfile,
      isAdmin,
      loading,
      error,
      clearError,
      favorites,
      history,
      presets,
      siteSettings,
      loginWithGoogle: signInWithGoogle,
      signInWithGoogle,
      loginWithEmail: signInWithEmail,
      signInWithEmail,
      signupWithEmail: signUpWithEmail,
      signUpWithEmail,
      sendPasswordReset,
      resetPassword: sendPasswordReset,
      logout: signOutUser,
      signOutUser,
      toggleFavorite,
      removeFavorite,
      isFavorite,
      addHistoryItem,
      addHistory,
      savePreset,
      deletePreset,
      clearHistory,
      updateSiteSettings,
      updateUserProfile,
      getAllUsers,
      updateUserRole,
      updateUserStatus,
      deleteUserAccount,
      createAdminUser,
      getAdminLogs,
      logAdminAction,
      clearAdminLogs
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};
