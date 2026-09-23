import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider, useTheme } from './context/ThemeContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { Footer } from './components/layout/Footer';
import { HomePage } from './components/home/HomePage';
import { ToolView } from './components/tools/ToolView';
import { NotFoundPage } from './components/common/NotFoundPage';
import { SEOHead } from './components/seo/SEOHead';
import { SearchModal } from './components/common/SearchModal';
import { FavoritesDrawer } from './components/common/FavoritesDrawer';
import { AuthModal } from './components/common/AuthModal';
import { KeyboardCheatSheetModal } from './components/common/KeyboardCheatSheetModal';
import { CustomThemeModal } from './components/common/CustomThemeModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { AdminPanel } from './components/admin/AdminPanel';
import { UserProfileModal } from './components/user/UserProfileModal';
import { MobileBottomNav } from './components/layout/MobileBottomNav';
import { getToolBySlug, TOOLS_DATA, CATEGORIES } from './data/toolsData';
import { getHomeSEOConfig, getCategorySEOConfig, getAdminSEOConfig } from './utils/seoConfig';
import { ToolItem } from './types';
import { recordToolClick } from './utils/toolAnalytics';
import { Sparkles, Shield, X } from 'lucide-react';

function AppContent() {
  const { isThemeModalOpen, closeThemeModal, openThemeModal } = useTheme();
  const [activeTool, setActiveTool] = useState<ToolItem | null>(null);
  const [notFoundSlug, setNotFoundSlug] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [memberOnlyFilter, setMemberOnlyFilter] = useState<boolean>(false);
  const [searchModalOpen, setSearchModalOpen] = useState<boolean>(false);
  const [favoritesDrawerOpen, setFavoritesDrawerOpen] = useState<boolean>(false);
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [userProfileModalOpen, setUserProfileModalOpen] = useState<boolean>(false);
  const [cheatSheetOpen, setCheatSheetOpen] = useState<boolean>(false);
  const [adminPanelOpen, setAdminPanelOpen] = useState<boolean>(false);
  const [showBanner, setShowBanner] = useState<boolean>(true);
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth >= 1024;
    }
    return true;
  });
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('toolstack_dark_mode');
      if (saved !== null) return saved === 'true';
      return window.matchMedia('(prefers-color-scheme: dark)').matches;
    }
    return false;
  });

  // Close mobile drawer when resizing up to tablet/desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setMobileSidebarOpen(false);
      }
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('toolstack_dark_mode', darkMode.toString());
  }, [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode(prev => !prev);
  };

  // Helper to detect repository base path when hosted on GitHub Pages (e.g. /my-repo)
  const getBasePath = useCallback((): string => {
    if (typeof window === 'undefined') return '';
    const isGitHubPages = window.location.hostname.endsWith('github.io');
    if (isGitHubPages) {
      const segments = window.location.pathname.split('/').filter(Boolean);
      if (segments.length > 0) {
        const first = segments[0];
        if (first !== 'tools' && first !== 'calculators' && first !== 'admin') {
          return `/${first}`;
        }
      }
    }
    return '';
  }, []);

  // Route resolver: parses pathname, search params, 404 SPA redirects, or hash
  const resolveRoute = useCallback(() => {
    const pathname = window.location.pathname;
    const searchParams = new URLSearchParams(window.location.search);
    const hash = window.location.hash.replace(/^#\/?/, '');

    // Check if redirected from GitHub Pages 404.html via ?p=...
    const pParam = searchParams.get('p');
    let toolSlug = searchParams.get('tool') || hash;

    if (!toolSlug && pParam) {
      const pMatch = pParam.match(/(?:tools|calculators)\/([^/?#]+)/);
      if (pMatch && pMatch[1]) {
        toolSlug = pMatch[1];
      }
    }

    if (!toolSlug) {
      // Check /tools/[slug] or /calculators/[slug] anywhere in pathname
      const toolMatch = pathname.match(/(?:tools|calculators)\/([^/?#]+)/);
      if (toolMatch && toolMatch[1]) {
        toolSlug = toolMatch[1];
      }
    }

    if (toolSlug) {
      const found = getToolBySlug(toolSlug);
      if (found) {
        setActiveTool(found);
        setNotFoundSlug(null);
        setSelectedCategory(null);
        setAdminPanelOpen(false);
        return;
      } else {
        setNotFoundSlug(toolSlug);
        setActiveTool(null);
        setSelectedCategory(null);
        setAdminPanelOpen(false);
        return;
      }
    }

    // Check category route: /category/[catId]
    const catMatch = pathname.match(/\/category\/([^/?#]+)/) || (pParam && pParam.match(/category\/([^/?#]+)/));
    if (catMatch && catMatch[1]) {
      const catId = catMatch[1];
      if (CATEGORIES.some(c => c.id === catId)) {
        setSelectedCategory(catId);
        setActiveTool(null);
        setNotFoundSlug(null);
        setAdminPanelOpen(false);
        return;
      }
    }

    const isAdminRoute = pathname.includes('/admin') || 
                         searchParams.get('admin') === 'true' || 
                         (pParam && pParam.includes('admin'));
    if (isAdminRoute) {
      setAdminPanelOpen(true);
      setActiveTool(null);
      setNotFoundSlug(null);
      return;
    }

    // Default: home
    setActiveTool(null);
    setNotFoundSlug(null);
    setAdminPanelOpen(false);
  }, []);

  // Initialize route on mount and listen to browser popstate
  useEffect(() => {
    resolveRoute();

    const handlePopState = () => {
      resolveRoute();
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [resolveRoute]);

  // Derive SEO metadata for the current view when not in an active tool (ToolView provides its own)
  const activeSEOConfig = useMemo(() => {
    if (adminPanelOpen) {
      return getAdminSEOConfig();
    }
    if (selectedCategory) {
      const cat = CATEGORIES.find(c => c.id === selectedCategory);
      if (cat) {
        return getCategorySEOConfig(cat);
      }
    }
    return getHomeSEOConfig();
  }, [adminPanelOpen, selectedCategory]);

  // Sync activeTool with URL & Document Title & SEO meta tags
  useEffect(() => {
    const basePath = getBasePath();

    if (activeTool) {
      const toolSubpath = activeTool.category === 'calculator' 
        ? `/calculators/${activeTool.slug}` 
        : `/tools/${activeTool.slug}`;
      const newPath = `${basePath}${toolSubpath}`;

      if (window.location.pathname !== newPath) {
        window.history.pushState({ toolId: activeTool.id }, '', newPath);
      }
    } else if (adminPanelOpen) {
      const newPath = `${basePath}/admin`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
    } else if (selectedCategory) {
      const newPath = `${basePath}/category/${selectedCategory}`;
      if (window.location.pathname !== newPath) {
        window.history.pushState({}, '', newPath);
      }
    } else if (!notFoundSlug) {
      const homePath = basePath ? `${basePath}/` : '/';
      const isSubRoute = window.location.pathname.includes('/tools/') || 
                         window.location.pathname.includes('/calculators/') || 
                         window.location.pathname.includes('/category/') ||
                         window.location.pathname.includes('/admin');
      if (isSubRoute) {
        window.history.pushState({}, '', homePath);
      }
    }

    // Scroll to top upon page navigation
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [activeTool, adminPanelOpen, selectedCategory, notFoundSlug, getBasePath]);

  const handleGoHome = useCallback(() => {
    setActiveTool(null);
    setSelectedCategory(null);
    setNotFoundSlug(null);
    setMemberOnlyFilter(false);
    setAdminPanelOpen(false);
    const basePath = getBasePath();
    const homePath = basePath ? `${basePath}/` : '/';
    if (window.location.pathname !== homePath) {
      window.history.pushState({}, '', homePath);
    }
  }, [getBasePath]);

  // Global Keyboard Shortcuts (Cmd+K or Ctrl+K for search, ? for cheat sheet, Esc to close)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA' || target.isContentEditable);

      // Cmd+K or Ctrl+K for search modal
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setSearchModalOpen(prev => !prev);
        return;
      }

      // ? or Shift+/ or Ctrl+/ for Cheat Sheet modal
      if (!isInput && (e.key === '?' || (e.shiftKey && e.key === '/'))) {
        e.preventDefault();
        setCheatSheetOpen(prev => !prev);
        return;
      }
      if ((e.metaKey || e.ctrlKey) && e.key === '/') {
        e.preventDefault();
        setCheatSheetOpen(prev => !prev);
        return;
      }

      // Quick slash / for search (if not typing in input)
      if (!isInput && e.key === '/' && !e.metaKey && !e.ctrlKey) {
        e.preventDefault();
        setSearchModalOpen(true);
        return;
      }

      // Alt+H -> Home
      if (e.altKey && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        handleGoHome();
        return;
      }

      // Alt+F -> Favorites
      if (e.altKey && e.key.toLowerCase() === 'f') {
        e.preventDefault();
        setFavoritesDrawerOpen(prev => !prev);
        return;
      }

      // Alt+T -> Theme Toggle
      if (e.altKey && e.key.toLowerCase() === 't') {
        e.preventDefault();
        toggleDarkMode();
        return;
      }

      // Alt+P -> Custom Tools Theme Designer
      if (e.altKey && e.key.toLowerCase() === 'p') {
        e.preventDefault();
        openThemeModal();
        return;
      }

      // Alt+B -> Sidebar Toggle
      if (e.altKey && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSidebarOpen(prev => !prev);
        return;
      }

      // Escape key closes open modals
      if (e.key === 'Escape') {
        setCheatSheetOpen(false);
        setSearchModalOpen(false);
        setFavoritesDrawerOpen(false);
        setAuthModalOpen(false);
        closeThemeModal();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleGoHome, openThemeModal, closeThemeModal]);

  const handleSelectTool = (tool: ToolItem) => {
    recordToolClick(tool.id);
    setActiveTool(tool);
    setNotFoundSlug(null);
    setAdminPanelOpen(false);
  };

  const handleSelectCategory = (catId: string | null) => {
    setSelectedCategory(catId);
    setActiveTool(null);
    setNotFoundSlug(null);
    setAdminPanelOpen(false);
    const basePath = getBasePath();
    const newPath = catId ? `${basePath}/category/${catId}` : (basePath ? `${basePath}/` : '/');
    if (window.location.pathname !== newPath) {
      window.history.pushState({}, '', newPath);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#F8FAFC] dark:bg-slate-950 text-[#0F172A] dark:text-slate-100 font-sans transition-colors">
        {/* Dynamic SEO & Structured Data Head (for Home, Category & Admin views) */}
        {!activeTool && !notFoundSlug && <SEOHead config={activeSEOConfig} />}

        {/* Top Announcement Banner */}
        {showBanner && (
          <div className="bg-gradient-to-r from-indigo-600 via-indigo-700 to-purple-700 text-white text-xs py-2 px-4 flex items-center justify-between shadow-xs">
            <div className="flex-1 flex items-center justify-center gap-2 font-medium">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                <strong>ToolStack 4.0:</strong> All 1,200+ utilities operate 100% inside your browser with zero data tracking.
              </span>
            </div>
            <button
              onClick={() => setShowBanner(false)}
              className="p-1 text-white/80 hover:text-white rounded-md transition-colors"
              title="Dismiss announcement"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* Navigation Bar */}
        <Navbar
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenFavorites={() => setFavoritesDrawerOpen(true)}
          onOpenAuth={() => setAuthModalOpen(true)}
          onOpenAdmin={() => setAdminPanelOpen(true)}
          onOpenProfile={() => setUserProfileModalOpen(true)}
          onOpenHelp={() => setCheatSheetOpen(true)}
          onSelectCategory={handleSelectCategory}
          onGoHome={handleGoHome}
          darkMode={darkMode}
          onToggleDarkMode={toggleDarkMode}
          onToggleSidebar={() => {
            if (window.innerWidth < 768) {
              setMobileSidebarOpen(prev => !prev);
            } else {
              setSidebarOpen(prev => !prev);
            }
          }}
        />

        {/* Main Body with Sidebar Layout */}
        <div className="flex-1 flex w-full">
          <Sidebar
            isOpen={sidebarOpen}
            onToggle={() => setSidebarOpen(prev => !prev)}
            selectedCategory={selectedCategory}
            onSelectCategory={handleSelectCategory}
            onGoHome={handleGoHome}
            onOpenSearch={() => setSearchModalOpen(true)}
            onOpenFavorites={() => setFavoritesDrawerOpen(true)}
            onOpenAuth={() => setAuthModalOpen(true)}
            onOpenHelp={() => setCheatSheetOpen(true)}
            onSelectTool={handleSelectTool}
            darkMode={darkMode}
            onToggleDarkMode={toggleDarkMode}
            isMobileOpen={mobileSidebarOpen}
            onCloseMobile={() => setMobileSidebarOpen(false)}
          />

          <div className="flex-1 min-w-0 flex flex-col pb-16 md:pb-0">
            {/* Main Content Area */}
            <main className="flex-1 overflow-x-hidden">
              {notFoundSlug ? (
                <div key="not-found" className="w-full animate-in fade-in duration-200">
                  <NotFoundPage
                    requestedSlug={notFoundSlug}
                    onGoHome={handleGoHome}
                    onSelectTool={handleSelectTool}
                  />
                </div>
              ) : adminPanelOpen ? (
                <div
                  key="admin-panel"
                  className="w-full animate-admin-fade-in"
                >
                  <AdminPanel
                    onClose={() => setAdminPanelOpen(false)}
                    onSelectTool={handleSelectTool}
                  />
                </div>
              ) : activeTool ? (
                <div
                  key={`tool-${activeTool.id}`}
                  className="w-full animate-tool-slide-in"
                >
                  <ToolView
                    tool={activeTool}
                    onBack={handleGoHome}
                    onSelectTool={handleSelectTool}
                    onSelectCategory={(catId) => handleSelectCategory(catId)}
                    onOpenAuth={() => setAuthModalOpen(true)}
                  />
                </div>
              ) : (
                <div
                  key={`home-${selectedCategory || 'all'}`}
                  className="w-full animate-home-slide-in"
                >
                  <HomePage
                    onSelectTool={handleSelectTool}
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleSelectCategory}
                    onOpenSearch={() => setSearchModalOpen(true)}
                    memberOnlyFilter={memberOnlyFilter}
                    onToggleMemberFilter={() => setMemberOnlyFilter(prev => !prev)}
                  />
                </div>
              )}
            </main>

            {/* Footer */}
            <Footer
              onSelectCategory={handleSelectCategory}
              onOpenAdmin={() => setAdminPanelOpen(true)}
              onOpenHelp={() => setCheatSheetOpen(true)}
            />
          </div>
        </div>

        {/* Mobile Bottom Navigation Bar (Smartphones & mobile screens) */}
        <MobileBottomNav
          onGoHome={handleGoHome}
          onOpenSearch={() => setSearchModalOpen(true)}
          onOpenCategories={() => setMobileSidebarOpen(true)}
          onOpenFavorites={() => setFavoritesDrawerOpen(true)}
          onToggleMemberFilter={() => {
            if (activeTool || adminPanelOpen) {
              handleGoHome();
            }
            setMemberOnlyFilter(prev => !prev);
          }}
          isHomeActive={!activeTool && !adminPanelOpen && !selectedCategory}
          isMemberFilterActive={memberOnlyFilter}
        />

        {/* Global Modals & Drawers */}
        <SearchModal
          isOpen={searchModalOpen}
          onClose={() => setSearchModalOpen(false)}
          onSelectTool={handleSelectTool}
        />

        <FavoritesDrawer
          isOpen={favoritesDrawerOpen}
          onClose={() => setFavoritesDrawerOpen(false)}
          onSelectTool={handleSelectTool}
        />

        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
        />

        <UserProfileModal
          isOpen={userProfileModalOpen}
          onClose={() => setUserProfileModalOpen(false)}
          onSelectTool={handleSelectTool}
          onOpenAdmin={() => setAdminPanelOpen(true)}
        />

        <KeyboardCheatSheetModal
          isOpen={cheatSheetOpen}
          onClose={() => setCheatSheetOpen(false)}
          onOpenSearch={() => {
            setCheatSheetOpen(false);
            setSearchModalOpen(true);
          }}
          onToggleDarkMode={toggleDarkMode}
        />

        {/* Custom Tools Theme Designer Modal */}
        <CustomThemeModal
          isOpen={isThemeModalOpen}
          onClose={closeThemeModal}
        />

        {/* Real-time Offline Connectivity Status */}
        <OfflineIndicator />
      </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}
