import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { DataProvider, useData } from './context/DataContext';
import { Header } from './components/common/Header';
import { BottomNav, TabKey } from './components/common/BottomNav';
import { HomeScreen } from './components/student/HomeScreen';
import { BooksScreen } from './components/student/BooksScreen';
import { ChapterScreen } from './components/student/ChapterScreen';
import { PracticeCenter } from './components/student/PracticeCenter';
import { BookmarksScreen } from './components/student/BookmarksScreen';
import { ProfileScreen } from './components/student/ProfileScreen';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { PWAInstallModal } from './components/common/PWAInstallModal';
import { OfflineIndicator } from './components/common/OfflineIndicator';
import { OfflineLibraryModal } from './components/common/OfflineLibraryModal';
import { GlobalSearchResult } from './types';

function MainApp() {
  const { isAdmin } = useAuth();
  const { books } = useData();

  // Navigation state
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const [selectedBookId, setSelectedBookId] = useState<string>('book_med');
  const [activeChapterId, setActiveChapterId] = useState<string | null>(null);

  // Search Modal state
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // PWA Install / Download Modal state
  const [isInstallModalOpen, setIsInstallModalOpen] = useState(false);

  // Offline Library Modal state
  const [isOfflineLibraryOpen, setIsOfflineLibraryOpen] = useState(false);

  // Android Viewport Device Frame mode
  const [viewMode, setViewMode] = useState<'phone' | 'tablet' | 'full'>('full');

  // Navigation handlers
  const handleSelectBook = (bookId: string) => {
    setSelectedBookId(bookId);
    setActiveChapterId(null);
    setActiveTab('books');
  };

  const handleOpenChapter = (chapterId: string) => {
    setActiveChapterId(chapterId);
  };

  const handleBackFromChapter = () => {
    setActiveChapterId(null);
  };

  const handleNavigateToSearchResult = (result: GlobalSearchResult) => {
    if (result.bookId) {
      setSelectedBookId(result.bookId);
    }
    if (result.chapterId) {
      setActiveChapterId(result.chapterId);
    } else {
      setActiveChapterId(null);
      setActiveTab('books');
    }
  };

  const handleOpenChapterMCQ = (chapterId: string) => {
    setActiveChapterId(chapterId);
  };

  // Frame container classes
  const frameClasses = {
    phone: 'max-w-md mx-auto my-4 rounded-[40px] shadow-2xl border-[8px] border-slate-900 bg-white dark:bg-slate-950 overflow-hidden ring-1 ring-slate-800',
    tablet: 'max-w-3xl mx-auto my-4 rounded-[32px] shadow-2xl border-[8px] border-slate-900 bg-white dark:bg-slate-950 overflow-hidden ring-1 ring-slate-800',
    full: 'w-full min-h-screen bg-slate-100 dark:bg-slate-950'
  };

  return (
    <div className={`min-h-screen flex flex-col bg-slate-200/70 dark:bg-slate-950 transition-colors`}>
      <div className={`flex flex-col flex-1 ${frameClasses[viewMode]}`}>
        {/* Android Top Header */}
        <Header
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenInstall={() => setIsInstallModalOpen(true)}
          onOpenOfflineLibrary={() => setIsOfflineLibraryOpen(true)}
          activeViewMode={viewMode}
          onChangeViewMode={setViewMode}
          selectedBookId={selectedBookId}
          onSelectBook={handleSelectBook}
        />

        {/* Main Content Area */}
        <main className="flex-1 px-4 sm:px-6 py-5 max-w-5xl mx-auto w-full">
          {activeChapterId ? (
            <ChapterScreen
              chapterId={activeChapterId}
              onBack={handleBackFromChapter}
              onNavigateChapter={handleOpenChapter}
            />
          ) : (
            <>
              {activeTab === 'home' && (
                <HomeScreen
                  onSelectBook={handleSelectBook}
                  onOpenChapter={handleOpenChapter}
                  onNavigateTab={tab => setActiveTab(tab)}
                  onOpenInstall={() => setIsInstallModalOpen(true)}
                  onOpenOfflineLibrary={() => setIsOfflineLibraryOpen(true)}
                />
              )}

              {activeTab === 'books' && (
                <BooksScreen
                  selectedBookId={selectedBookId}
                  onSelectBook={setSelectedBookId}
                  onOpenChapter={handleOpenChapter}
                />
              )}

              {activeTab === 'practice' && (
                <PracticeCenter onOpenChapterMCQ={handleOpenChapterMCQ} />
              )}

              {activeTab === 'bookmarks' && (
                <BookmarksScreen onOpenChapter={handleOpenChapter} />
              )}

              {activeTab === 'profile' && (
                <ProfileScreen
                  onOpenChapterMCQ={handleOpenChapterMCQ}
                  onOpenInstall={() => setIsInstallModalOpen(true)}
                />
              )}

              {activeTab === 'admin' && (
                <AdminDashboard onPreviewChapter={handleOpenChapter} />
              )}
            </>
          )}
        </main>

        {/* Material 3 Bottom Navigation Bar */}
        <BottomNav
          activeTab={activeChapterId ? 'books' : activeTab}
          onTabChange={tab => {
            setActiveChapterId(null);
            setActiveTab(tab);
          }}
        />

        {/* Global Search Modal */}
        <GlobalSearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
          onNavigateToResult={handleNavigateToSearchResult}
        />

        {/* Phone App Download & Install Modal */}
        <PWAInstallModal
          isOpen={isInstallModalOpen}
          onClose={() => setIsInstallModalOpen(false)}
        />

        {/* Offline Learning Library Modal */}
        <OfflineLibraryModal
          isOpen={isOfflineLibraryOpen}
          onClose={() => setIsOfflineLibraryOpen(false)}
          onOpenChapter={handleOpenChapter}
        />

        {/* Ambient Offline Notification Indicator */}
        <OfflineIndicator
          onOpenOfflineLibrary={() => setIsOfflineLibraryOpen(true)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <MainApp />
      </DataProvider>
    </AuthProvider>
  );
}
