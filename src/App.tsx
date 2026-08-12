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

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [profile, setProfile] = useState<CatProfile | null>(null);
  const [history, setHistory] = useState<HistoryRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState<'home' | 'pain' | 'bcs' | 'history'>('home');

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

  const handleReset = async () => {
    if (confirm("¿Estás seguro de que deseas cerrar sesión y borrar los datos de tu gato? Esto no se puede deshacer.")) {
      await clearData();
      setIsAuthenticated(false);
      setProfile(null);
      setHistory([]);
      setCurrentView('home');
    }
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
    setCurrentView('home');
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
    setCurrentView('home');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-orange-400" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#faf8f5] text-gray-900 font-sans selection:bg-orange-200">
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : !profile ? (
        <ProfileSetup onComplete={handleProfileComplete} />
      ) : (
        <>
          {currentView === 'home' && (
            <Home 
              profile={profile} 
              onNavigate={setCurrentView} 
              onReset={handleReset} 
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
        </>
      )}
    </div>
  );
}
