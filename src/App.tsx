import { useState, useEffect } from 'react';
import { CatProfile, HistoryRecord, PainResult, BCSResult } from './types';
import { 
  getAuthState, 
  getProfiles, 
  saveProfile, 
  deleteProfile, 
  getHistory, 
  addHistoryRecord, 
  clearData, 
  setAuthState,
  getActiveCatId,
  setActiveCatId
} from './db';
import { AppLayout } from './components/AppLayout';
import { Home } from './components/Home';
import { PainCheck } from './components/PainCheck';
import { BCSCheck } from './components/BCSCheck';
import { History as HistoryView } from './components/History';
import { ProfileSetup } from './components/ProfileSetup';
import { Login } from './components/Login';
import { ManageCatsModal } from './components/ManageCatsModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';
import { Logo } from './components/Logo';
import { motion } from 'motion/react';

export function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [profiles, setProfiles] = useState<CatProfile[]>([]);
  const [activeProfile, setActiveProfile] = useState<CatProfile | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [currentView, setCurrentView] = useState<'home' | 'pain' | 'bcs' | 'history'>('home');
  const [loading, setLoading] = useState<boolean>(true);
  const [isAddingNewCat, setIsAddingNewCat] = useState<boolean>(false);
  const [isManageCatsOpen, setIsManageCatsOpen] = useState<boolean>(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);

  useEffect(() => {
    initApp();
  }, []);

  const initApp = async () => {
    try {
      const isAuth = await getAuthState();
      setIsAuthenticated(isAuth);
      
      if (isAuth) {
        // Fetch all cats for user
        const allCats = await getProfiles();
        setProfiles(allCats);

        // Determine active cat
        const savedActiveId = getActiveCatId();
        const found = allCats.find(c => c.id === savedActiveId);
        const currentCat = found || allCats[0] || null;
        setActiveProfile(currentCat);

        if (currentCat?.id) {
          setActiveCatId(currentCat.id);
        }

        // Fetch history
        const records = await getHistory(currentCat?.id);
        setHistory(records);
      }
    } catch (e) {
      console.error("Initialization error:", e);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setIsAuthenticated(true);
    const allCats = await getProfiles();
    setProfiles(allCats);
    const currentCat = allCats[0] || null;
    setActiveProfile(currentCat);
    if (currentCat?.id) {
      setActiveCatId(currentCat.id);
      const records = await getHistory(currentCat.id);
      setHistory(records);
    }
  };

  const handleSelectProfile = async (profile: CatProfile) => {
    setActiveProfile(profile);
    if (profile.id) {
      setActiveCatId(profile.id);
      const records = await getHistory(profile.id);
      setHistory(records);
    }
  };

  const handleProfileComplete = async (newProfile: CatProfile) => {
    const saved = await saveProfile(newProfile);
    const allCats = await getProfiles();
    setProfiles(allCats);
    const active = saved || allCats[0] || null;
    setActiveProfile(active);
    if (active?.id) {
      setActiveCatId(active.id);
      const records = await getHistory(active.id);
      setHistory(records);
    }
    setIsAddingNewCat(false);
    setCurrentView('home');
  };

  const handleUpdateProfile = async (updated: CatProfile) => {
    const saved = await saveProfile(updated);
    const allCats = await getProfiles();
    setProfiles(allCats);
    if (activeProfile?.id === saved?.id && saved) {
      setActiveProfile(saved);
    }
  };

  const handleDeleteProfile = async (catId: string) => {
    const remaining = await deleteProfile(catId);
    setProfiles(remaining);
    if (activeProfile?.id === catId) {
      const nextActive = remaining[0] || null;
      setActiveProfile(nextActive);
      if (nextActive?.id) {
        setActiveCatId(nextActive.id);
        const records = await getHistory(nextActive.id);
        setHistory(records);
      } else {
        setHistory([]);
      }
    }
  };

  const handleLogout = async () => {
    await setAuthState(false);
    setIsAuthenticated(false);
    setActiveProfile(null);
    setProfiles([]);
    setHistory([]);
    setCurrentView('home');
    setIsLogoutModalOpen(false);
  };

  const handleClearData = async () => {
    await clearData();
    setIsAuthenticated(false);
    setActiveProfile(null);
    setProfiles([]);
    setHistory([]);
    setCurrentView('home');
    setIsLogoutModalOpen(false);
  };

  const handleSavePain = async (photoUrl: string, result: PainResult) => {
    const record: HistoryRecord = {
      id: crypto.randomUUID(),
      catId: activeProfile?.id,
      date: Date.now(),
      type: 'pain',
      photoUrl,
      result
    };
    await addHistoryRecord(record);
    setHistory(prev => [record, ...prev]);
    setCurrentView('history');
  };

  const handleSaveBcs = async (photoUrl: string, photoUrl2: string, result: BCSResult) => {
    const record: HistoryRecord = {
      id: crypto.randomUUID(),
      catId: activeProfile?.id,
      date: Date.now(),
      type: 'bcs',
      photoUrl,
      photoUrl2,
      result
    };
    await addHistoryRecord(record);
    setHistory(prev => [record, ...prev]);
    setCurrentView('history');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fff5eb] to-[#ffeedb] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 flex flex-col items-center justify-center transition-colors duration-300 relative overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-orange-400/15 dark:bg-orange-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-rose-400/15 dark:bg-rose-600/10 rounded-full blur-3xl pointer-events-none" />
        
        <motion.div 
          animate={{ y: [-10, 0, -10] }}
          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
          className="relative z-10"
        >
          <Logo className="w-16 h-16 drop-shadow-lg mb-4" />
        </motion.div>
        <span className="text-orange-600 dark:text-orange-400 font-extrabold tracking-widest text-[13px] animate-pulse relative z-10">
          DESPERTANDO AL MICHI...
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#fffaf5] via-[#fff5eb] to-[#ffeedb] dark:from-neutral-950 dark:via-neutral-900 dark:to-neutral-950 text-neutral-900 dark:text-neutral-100 font-sans selection:bg-orange-200 dark:selection:bg-orange-900 transition-colors duration-300 relative overflow-x-hidden">
      
      {/* Platform-wide Soft Ambient Light Accents */}
      <div className="fixed -top-32 -left-32 w-[450px] h-[450px] bg-orange-300/15 dark:bg-orange-600/5 rounded-full blur-3xl pointer-events-none z-0" />
      <div className="fixed -bottom-32 -right-32 w-[450px] h-[450px] bg-rose-300/15 dark:bg-rose-600/5 rounded-full blur-3xl pointer-events-none z-0" />

      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : profiles.length === 0 || !activeProfile ? (
        /* First cat onboarding registration with the happy cat */
        <ProfileSetup onComplete={handleProfileComplete} />
      ) : isAddingNewCat ? (
        /* Additional cat registration flow with the happy cat & cancel button */
        <ProfileSetup 
          onComplete={handleProfileComplete} 
          onCancel={() => setIsAddingNewCat(false)}
          isAdditional={true}
        />
      ) : (
        <>
          <AppLayout
            currentView={currentView}
            onNavigate={setCurrentView}
            profile={activeProfile}
            profiles={profiles}
            records={history}
            onSelectProfile={handleSelectProfile}
            onAddNewCat={() => setIsAddingNewCat(true)}
            onManageCats={() => setIsManageCatsOpen(true)}
            onReset={() => setIsLogoutModalOpen(true)}
          >
            {currentView === 'home' && (
              <Home 
                profile={activeProfile} 
                records={history}
                onNavigate={setCurrentView} 
              />
            )}
            {currentView === 'pain' && (
              <PainCheck 
                onBack={() => setCurrentView('home')} 
                onSave={handleSavePain} 
              />
            )}
            {currentView === 'bcs' && (
              <BCSCheck 
                onBack={() => setCurrentView('home')} 
                onSave={handleSaveBcs} 
              />
            )}
            {currentView === 'history' && (
              <HistoryView 
                onBack={() => setCurrentView('home')} 
                records={history} 
                profiles={profiles}
                activeProfile={activeProfile}
              />
            )}
          </AppLayout>

          {/* Manage Cats Modal */}
          <ManageCatsModal
            isOpen={isManageCatsOpen}
            onClose={() => setIsManageCatsOpen(false)}
            profiles={profiles}
            activeProfile={activeProfile}
            onSelectProfile={handleSelectProfile}
            onUpdateProfile={handleUpdateProfile}
            onDeleteProfile={handleDeleteProfile}
            onAddNewCat={() => {
              setIsManageCatsOpen(false);
              setIsAddingNewCat(true);
            }}
          />

          {/* Logout Modal */}
          <LogoutConfirmModal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onLogout={handleLogout}
            onClearData={handleClearData}
            catName={activeProfile?.name}
          />
        </>
      )}
    </div>
  );
}

export default App;
