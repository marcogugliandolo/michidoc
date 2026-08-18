import { useEffect, useState } from 'react';
import { CatProfile, HistoryRecord, PainResult, BCSResult } from './types';
import { getProfile, saveProfile, getHistory, addHistoryRecord, clearData, getAuthState, setAuthState } from './db';
import { Login } from './components/Login';
import { ProfileSetup } from './components/ProfileSetup';
import { Home } from './components/Home';
import { PainCheck } from './components/PainCheck';
import { BCSCheck } from './components/BCSCheck';
import { History as HistoryView } from './components/History';
import { Loader2 } from 'lucide-react';
import { AppLayout } from './components/AppLayout';
import { EditProfileModal } from './components/EditProfileModal';
import { LogoutConfirmModal } from './components/LogoutConfirmModal';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<CatProfile | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'pain' | 'bcs' | 'history'>('home');
  const [isEditProfileOpen, setIsEditProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  useEffect(() => {
    async function loadData() {
      const auth = await getAuthState();
      setIsAuthenticated(auth);
      
      if (auth) {
        const p = await getProfile();
        const h = await getHistory();
        setProfile(p);
        setHistory(h);
      }
      setLoading(false);
    }
    loadData();
  }, []);

  const handleLogin = async () => {
    setIsAuthenticated(true);
    const p = await getProfile();
    const h = await getHistory();
    setProfile(p);
    setHistory(h);
  };

  const handleProfileComplete = async (p: CatProfile) => {
    await saveProfile(p);
    setProfile(p);
  };

  const handleUpdateProfile = async (updatedProfile: CatProfile) => {
    await saveProfile(updatedProfile);
    setProfile(updatedProfile);
  };

  const handleLogout = async () => {
    await setAuthState(false);
    setIsAuthenticated(false);
    setProfile(null);
    setHistory([]);
    setCurrentView('home');
    setIsLogoutModalOpen(false);
  };

  const handleClearAll = async () => {
    await clearData();
    setIsAuthenticated(false);
    setProfile(null);
    setHistory([]);
    setCurrentView('home');
    setIsLogoutModalOpen(false);
  };

  const handleSavePain = async (photoUrl: string, result: PainResult) => {
    const record: HistoryRecord = {
      id: crypto.randomUUID(),
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
      <div className="min-h-screen bg-[#faf8f5] dark:bg-neutral-950 flex items-center justify-center transition-colors duration-200">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] dark:bg-neutral-950 text-gray-900 dark:text-neutral-100 font-sans selection:bg-orange-200 dark:selection:bg-orange-900 transition-colors duration-200">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : !profile ? (
        <ProfileSetup onComplete={handleProfileComplete} />
      ) : (
        <>
          <AppLayout
            currentView={currentView}
            onNavigate={setCurrentView}
            profile={profile}
            records={history}
            onReset={() => setIsLogoutModalOpen(true)}
            onEditProfile={() => setIsEditProfileOpen(true)}
          >
            {currentView === 'home' && (
              <Home 
                profile={profile} 
                records={history}
                onNavigate={setCurrentView} 
                onReset={() => setIsLogoutModalOpen(true)} 
                onEditProfile={() => setIsEditProfileOpen(true)}
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
              />
            )}
          </AppLayout>

          {/* Edit Profile Modal */}
          {isEditProfileOpen && (
            <EditProfileModal
              isOpen={isEditProfileOpen}
              onClose={() => setIsEditProfileOpen(false)}
              profile={profile}
              onSave={handleUpdateProfile}
            />
          )}

          {/* Clean Logout Confirmation Modal (No iframe window.confirm block) */}
          {isLogoutModalOpen && (
            <LogoutConfirmModal
              isOpen={isLogoutModalOpen}
              onClose={() => setIsLogoutModalOpen(false)}
              onLogout={handleLogout}
              onClearAll={handleClearAll}
              catName={profile.name}
            />
          )}
        </>
      )}
    </div>
  );
}
