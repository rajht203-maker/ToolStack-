import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useTools } from '../../context/ToolsContext';
import { ToolItem } from '../../types';
import { ToolIconTile } from '../common/ToolIconTile';
import { maskName, maskEmail, isPrivacyModeEnabled, setPrivacyMode } from '../../utils/privacy';
import {
  Layers,
  Heart,
  History,
  Workflow,
  Sparkles,
  Cloud,
  CloudOff,
  RefreshCw,
  Play,
  Trash2,
  X,
  ShieldCheck,
  Eye,
  EyeOff,
  Smartphone,
  Laptop,
  CheckCircle2,
  Clock,
  ArrowRight,
  LogOut,
  Sliders,
  ChevronRight,
  Lock
} from 'lucide-react';

interface PersonalDashboardModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectTool: (tool: ToolItem) => void;
  onOpenAuth: () => void;
}

type DashboardTab = 'overview' | 'stack' | 'favorites' | 'history' | 'chains';

export const PersonalDashboardModal: React.FC<PersonalDashboardModalProps> = ({
  isOpen,
  onClose,
  onSelectTool,
  onOpenAuth
}) => {
  const {
    user,
    profile,
    myStack,
    removeFromStack,
    favorites,
    removeFavorite,
    history,
    lastUsedTool,
    savedChains,
    deleteChain,
    syncStatus,
    syncNow,
    signOutUser
  } = useAuth();

  const { tools } = useTools();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [privacyMasked, setPrivacyMasked] = useState<boolean>(isPrivacyModeEnabled);
  const [isSyncing, setIsSyncing] = useState<boolean>(false);

  useEffect(() => {
    const handlePrivacyChange = () => {
      setPrivacyMasked(isPrivacyModeEnabled());
    };
    window.addEventListener('toolstack_privacy_change', handlePrivacyChange);
    return () => {
      window.removeEventListener('toolstack_privacy_change', handlePrivacyChange);
    };
  }, []);

  const togglePrivacy = () => {
    const next = !privacyMasked;
    setPrivacyMasked(next);
    setPrivacyMode(next);
  };

  const handleManualSync = async () => {
    setIsSyncing(true);
    await syncNow();
    setTimeout(() => setIsSyncing(false), 600);
  };

  if (!isOpen) return null;

  // Resolve tool objects
  const getToolById = (id: string): ToolItem | undefined => {
    return tools.find(t => t.id === id || t.slug === id);
  };

  const lastToolObj = lastUsedTool ? getToolById(lastUsedTool.toolId) : null;

  const displayName = user
    ? (privacyMasked ? maskName(user.displayName) : (user.displayName || 'ToolStack Creator'))
    : 'Guest Explorer';

  const userEmailDisplay = user
    ? (privacyMasked ? maskEmail(user.email) : user.email)
    : 'Local workspace';

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/70 backdrop-blur-md animate-in fade-in duration-200"
      onClick={onClose}
    >
      <div
        className="w-full max-w-4xl max-h-[92vh] bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl flex flex-col overflow-hidden text-slate-800 dark:text-slate-100"
        onClick={e => e.stopPropagation()}
      >
        {/* Top Header & User Greeting */}
        <div className="p-4 sm:p-6 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/70 dark:bg-slate-900/90 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3.5">
            {/* User Avatar */}
            <div className="relative shrink-0">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-purple-600 text-white font-black text-lg flex items-center justify-center shadow-lg shadow-indigo-500/20 overflow-hidden">
                {user?.photoURL && !privacyMasked ? (
                  <img src={user.photoURL} alt="Avatar" width="48" height="48" className="w-full h-full object-cover" />
                ) : (
                  <span>{(user?.displayName || user?.email || 'T').charAt(0).toUpperCase()}</span>
                )}
              </div>
              {user && (
                <div
                  className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-white dark:border-slate-900"
                  title="Signed in via Google"
                />
              )}
            </div>

            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-black tracking-tight text-slate-900 dark:text-white truncate">
                  Welcome back, {displayName}
                </h2>
                {user ? (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-indigo-100 dark:bg-indigo-950/80 text-indigo-700 dark:text-indigo-300 shrink-0">
                    Pro Member
                  </span>
                ) : (
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-slate-200 dark:bg-slate-800 text-slate-600 dark:text-slate-300 shrink-0">
                    Guest Mode
                  </span>
                )}
              </div>

              <div className="text-xs text-slate-500 dark:text-slate-400 flex flex-wrap items-center gap-2 mt-0.5 font-mono">
                <span>{userEmailDisplay}</span>
                <button
                  type="button"
                  onClick={togglePrivacy}
                  className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200/80 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-300 dark:hover:bg-slate-700 transition-colors"
                  title={privacyMasked ? 'Reveal full personal details' : 'Enable Privacy Shield masking'}
                >
                  {privacyMasked ? <EyeOff className="w-3 h-3 text-indigo-500" /> : <Eye className="w-3 h-3" />}
                  <span>{privacyMasked ? 'Privacy Shielded' : 'Shield Off'}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Sync Status & Action Controls */}
          <div className="flex items-center gap-2 self-end sm:self-center">
            {/* Cloud Sync Status Badge */}
            <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold shadow-xs">
              {syncStatus === 'synced' ? (
                <>
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-emerald-700 dark:text-emerald-400">Cloud Synced</span>
                </>
              ) : syncStatus === 'syncing' || isSyncing ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 text-indigo-500 animate-spin" />
                  <span className="text-indigo-600 dark:text-indigo-400">Syncing...</span>
                </>
              ) : (
                <>
                  <CloudOff className="w-3.5 h-3.5 text-slate-400" />
                  <span className="text-slate-500 dark:text-slate-400">Local Only</span>
                </>
              )}

              {user && (
                <button
                  type="button"
                  onClick={handleManualSync}
                  disabled={isSyncing}
                  className="ml-1 p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 text-slate-400 hover:text-indigo-600 transition-colors"
                  title="Force re-sync across devices"
                >
                  <RefreshCw className={`w-3 h-3 ${isSyncing ? 'animate-spin' : ''}`} />
                </button>
              )}
            </div>

            {/* Google Login / Sign Out Button */}
            {!user ? (
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenAuth();
                }}
                className="px-3 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md shadow-indigo-500/20 transition-all flex items-center gap-1.5 cursor-pointer"
              >
                <span>Sign In to Sync</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={async () => {
                  await signOutUser();
                }}
                className="p-2 rounded-xl text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                title="Sign out of ToolStack"
              >
                <LogOut className="w-4 h-4" />
              </button>
            )}

            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Sync Device Cross-Promotion Notice */}
        <div className="px-4 sm:px-6 py-2 bg-indigo-50/60 dark:bg-indigo-950/30 border-b border-indigo-100/80 dark:border-indigo-900/50 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-2 text-indigo-950 dark:text-indigo-200">
            <div className="flex items-center gap-1 font-bold">
              <Smartphone className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span>+</span>
              <Laptop className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
            </div>
            <span>
              {user
                ? 'Your Stack, Favorites, and Chains are live synced across your phone and laptop.'
                : 'Sign in to access your custom Stack, saved recipes, and tool history on all devices.'}
            </span>
          </div>

          <div className="flex items-center gap-1 text-[11px] text-emerald-700 dark:text-emerald-400 font-semibold">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Metadata only • User files never leave browser</span>
          </div>
        </div>

        {/* Tab Navigation Navigation */}
        <div className="px-4 sm:px-6 pt-3 border-b border-slate-100 dark:border-slate-800 flex items-center gap-2 overflow-x-auto select-none">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'overview'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Dashboard Hub</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('stack')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'stack'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>My Stack</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
              {myStack.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('favorites')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'favorites'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Favourites</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
              {favorites.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('history')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'history'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>Recently Used</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
              {history.length}
            </span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('chains')}
            className={`pb-2.5 px-3 text-xs font-bold border-b-2 flex items-center gap-1.5 transition-colors whitespace-nowrap cursor-pointer ${
              activeTab === 'chains'
                ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <Workflow className="w-3.5 h-3.5" />
            <span>Chains &amp; Recipes</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-slate-100 dark:bg-slate-800 font-bold">
              {savedChains.length}
            </span>
          </button>
        </div>

        {/* Modal Scrollable Content Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6 animate-in fade-in duration-200">
              {/* "Continue Where You Left Off" Hero Card */}
              {lastToolObj && (
                <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white shadow-xl shadow-indigo-500/15 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1">
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-white/20 text-white backdrop-blur-xs">
                      <Clock className="w-3 h-3" /> Continue where you left off
                    </span>
                    <h3 className="text-lg font-black tracking-tight">{lastToolObj.name}</h3>
                    <p className="text-xs text-indigo-100 line-clamp-1 max-w-xl">
                      {lastUsedTool?.summary || lastToolObj.description}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      onSelectTool(lastToolObj);
                      onClose();
                    }}
                    className="px-5 py-2.5 rounded-xl bg-white text-indigo-600 hover:bg-indigo-50 font-black text-xs shadow-md transition-transform hover:scale-105 flex items-center justify-center gap-2 shrink-0 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-indigo-600" />
                    <span>Resume Tool</span>
                  </button>
                </div>
              )}

              {/* Quick Summary Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div
                  onClick={() => setActiveTab('stack')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-indigo-300 dark:hover:border-indigo-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-indigo-500">
                    <Layers className="w-4 h-4" />
                    <span className="text-xl font-black text-slate-900 dark:text-white">{myStack.length}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-2">My Stack</span>
                  <span className="text-[10px] text-slate-400">Pinned daily tools</span>
                </div>

                <div
                  onClick={() => setActiveTab('favorites')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-rose-300 dark:hover:border-rose-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-rose-500">
                    <Heart className="w-4 h-4" />
                    <span className="text-xl font-black text-slate-900 dark:text-white">{favorites.length}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-2">Favourites</span>
                  <span className="text-[10px] text-slate-400">Bookmarked utilities</span>
                </div>

                <div
                  onClick={() => setActiveTab('history')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-emerald-300 dark:hover:border-emerald-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-emerald-500">
                    <History className="w-4 h-4" />
                    <span className="text-xl font-black text-slate-900 dark:text-white">{history.length}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-2">Recent Runs</span>
                  <span className="text-[10px] text-slate-400">Activity history</span>
                </div>

                <div
                  onClick={() => setActiveTab('chains')}
                  className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/70 dark:border-slate-700/60 hover:border-purple-300 dark:hover:border-purple-600 transition-all cursor-pointer group"
                >
                  <div className="flex items-center justify-between text-slate-400 group-hover:text-purple-500">
                    <Workflow className="w-4 h-4" />
                    <span className="text-xl font-black text-slate-900 dark:text-white">{savedChains.length}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mt-2">Chains</span>
                  <span className="text-[10px] text-slate-400">Saved workflows</span>
                </div>
              </div>

              {/* My Stack Teaser Section */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                    <Layers className="w-3.5 h-3.5 text-indigo-500" />
                    My Custom Stack
                  </h4>
                  {myStack.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setActiveTab('stack')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      View all ({myStack.length})
                    </button>
                  )}
                </div>

                {myStack.length === 0 ? (
                  <div className="p-6 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                    <Layers className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                    <p className="text-xs font-bold text-slate-700 dark:text-slate-300">Your custom Stack is empty</p>
                    <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                      Pin your most used tools to create your personalized workflow deck accessible on any screen.
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                    {myStack.slice(0, 6).map(item => {
                      const toolObj = getToolById(item.toolId);
                      return (
                        <div
                          key={item.id}
                          onClick={() => {
                            if (toolObj) {
                              onSelectTool(toolObj);
                              onClose();
                            }
                          }}
                          className="p-3 rounded-xl bg-slate-50/80 dark:bg-slate-800/50 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 hover:border-indigo-400 dark:hover:border-indigo-500 transition-all cursor-pointer group"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <ToolIconTile
                              category={item.category}
                              iconName={toolObj?.icon || 'Wrench'}
                              size="sm"
                            />
                            <div className="min-w-0">
                              <span className="text-xs font-bold text-slate-900 dark:text-white truncate block group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                                {item.toolName}
                              </span>
                              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                                {item.category}
                              </span>
                            </div>
                          </div>

                          <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-indigo-600 transition-transform group-hover:translate-x-0.5" />
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Favourites Row */}
              {favorites.length > 0 && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 flex items-center gap-1.5">
                      <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
                      Starred Favourites
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('favorites')}
                      className="text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                    >
                      Manage ({favorites.length})
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                    {favorites.slice(0, 3).map(fav => {
                      const toolObj = getToolById(fav.toolId);
                      return (
                        <div
                          key={fav.id}
                          onClick={() => {
                            if (toolObj) {
                              onSelectTool(toolObj);
                              onClose();
                            }
                          }}
                          className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-700/60 flex items-center justify-between gap-2 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all cursor-pointer"
                        >
                          <div className="flex items-center gap-2 min-w-0">
                            <ToolIconTile
                              category={toolObj?.category || 'developer'}
                              iconName={toolObj?.icon || 'Heart'}
                              size="sm"
                            />
                            <span className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                              {fav.toolName}
                            </span>
                          </div>
                          <Play className="w-3 h-3 text-slate-400 shrink-0" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: MY STACK */}
          {activeTab === 'stack' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Personal Stack ({myStack.length})</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Your quick-access collection pinned to the top of your workspace and synced across all devices.
                  </p>
                </div>
              </div>

              {myStack.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-3">
                  <Layers className="w-10 h-10 text-slate-300 dark:text-slate-600 mx-auto" />
                  <div className="font-bold text-slate-700 dark:text-slate-200 text-sm">No tools in your stack yet</div>
                  <p className="text-xs text-slate-400 max-w-md mx-auto">
                    Click the &quot;Add to Stack&quot; icon on any tool card across the directory to pin your essential utilities here.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {myStack.map(item => {
                    const toolObj = getToolById(item.toolId);
                    return (
                      <div
                        key={item.id}
                        className="p-3.5 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs hover:border-indigo-400 transition-all"
                      >
                        <div
                          onClick={() => {
                            if (toolObj) {
                              onSelectTool(toolObj);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <ToolIconTile
                            category={item.category}
                            iconName={toolObj?.icon || 'Wrench'}
                            size="md"
                          />
                          <div className="min-w-0">
                            <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.toolName}
                            </h4>
                            <span className="text-[10px] text-slate-400 uppercase font-semibold">
                              {item.category}
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              if (toolObj) {
                                onSelectTool(toolObj);
                                onClose();
                              }
                            }}
                            className="p-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-100 transition-colors"
                            title="Launch Tool"
                          >
                            <Play className="w-3.5 h-3.5 fill-indigo-600 dark:fill-indigo-400" />
                          </button>

                          <button
                            type="button"
                            onClick={() => removeFromStack(item.toolId)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                            title="Remove from Stack"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 3: FAVOURITES */}
          {activeTab === 'favorites' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Favourites ({favorites.length})</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Starred tools saved to your account for fast reference.
                  </p>
                </div>
              </div>

              {favorites.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Heart className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No favourites bookmarked</p>
                  <p className="text-[11px] text-slate-400">
                    Click the heart icon on any tool to save it to your favourites list.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {favorites.map(fav => {
                    const toolObj = getToolById(fav.toolId);
                    return (
                      <div
                        key={fav.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 flex items-center justify-between gap-3 shadow-xs"
                      >
                        <div
                          onClick={() => {
                            if (toolObj) {
                              onSelectTool(toolObj);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-2.5 min-w-0 flex-1 cursor-pointer"
                        >
                          <ToolIconTile
                            category={toolObj?.category || 'developer'}
                            iconName={toolObj?.icon || 'Heart'}
                            size="sm"
                          />
                          <span className="text-xs font-bold text-slate-900 dark:text-white truncate">
                            {fav.toolName}
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => removeFavorite(fav.toolId)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="Unstar tool"
                        >
                          <Heart className="w-3.5 h-3.5 fill-rose-500" />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: HISTORY */}
          {activeTab === 'history' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Recent Tool Activity</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Timeline of tools executed on this device or synced from other browsers.
                  </p>
                </div>
              </div>

              {history.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <History className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No activity logged yet</p>
                  <p className="text-[11px] text-slate-400">
                    Execute a tool, calculator, or converter to record your activity here.
                  </p>
                </div>
              ) : (
                <div className="space-y-2">
                  {history.map(item => {
                    const toolObj = getToolById(item.toolId);
                    return (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-white dark:bg-slate-800/80 border border-slate-200/80 dark:border-slate-700/80 flex items-center justify-between gap-3 shadow-xs hover:border-slate-300 dark:hover:border-slate-600 transition-colors"
                      >
                        <div
                          onClick={() => {
                            if (toolObj) {
                              onSelectTool(toolObj);
                              onClose();
                            }
                          }}
                          className="flex items-center gap-3 min-w-0 flex-1 cursor-pointer"
                        >
                          <ToolIconTile
                            category={toolObj?.category || 'developer'}
                            iconName={toolObj?.icon || 'History'}
                            size="sm"
                          />
                          <div className="min-w-0">
                            <div className="text-xs font-bold text-slate-900 dark:text-white truncate">
                              {item.toolName}
                            </div>
                            <div className="text-[11px] text-slate-400 truncate">
                              {item.summary || 'Executed in browser'}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0">
                          <span className="text-[10px] text-slate-400 font-mono">
                            {new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <button
                            type="button"
                            onClick={() => {
                              if (toolObj) {
                                onSelectTool(toolObj);
                                onClose();
                              }
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 transition-colors"
                            title="Re-open Tool"
                          >
                            <Play className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {/* TAB 5: CHAINS & RECIPES */}
          {activeTab === 'chains' && (
            <div className="space-y-4 animate-in fade-in duration-200">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-slate-900 dark:text-white">Chains &amp; Recipes ({savedChains.length})</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    Saved multi-tool pipelines (e.g. Compress Image &rarr; Resize &rarr; Convert to WebP).
                  </p>
                </div>
              </div>

              {savedChains.length === 0 ? (
                <div className="p-8 rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 text-center space-y-2">
                  <Workflow className="w-8 h-8 text-slate-300 dark:text-slate-600 mx-auto" />
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">No saved recipes</p>
                  <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                    You can chain tools together and save one-tap recipes to execute routine multi-step actions instantly.
                  </p>
                </div>
              ) : (
                <div className="space-y-3">
                  {savedChains.map(chain => (
                    <div
                      key={chain.id}
                      className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2.5 shadow-xs"
                    >
                      <div className="flex items-center justify-between">
                        <h4 className="text-xs font-black text-slate-900 dark:text-white flex items-center gap-2">
                          <Workflow className="w-3.5 h-3.5 text-indigo-500" />
                          {chain.name}
                        </h4>
                        <button
                          type="button"
                          onClick={() => deleteChain(chain.id)}
                          className="p-1 text-slate-400 hover:text-rose-500 transition-colors"
                          title="Delete Recipe"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {chain.description}
                      </p>

                      <div className="flex flex-wrap items-center gap-1.5 pt-1">
                        {chain.toolIds.map((tid, idx) => {
                          const t = getToolById(tid);
                          return (
                            <React.Fragment key={tid}>
                              <span className="px-2 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                                {t?.name || tid}
                              </span>
                              {idx < chain.toolIds.length - 1 && (
                                <ArrowRight className="w-3 h-3 text-slate-400" />
                              )}
                            </React.Fragment>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
