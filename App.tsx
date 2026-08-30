import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AppProvider, useApp } from './context/AppContext';
import { Header } from './components/Navigation';
import { BiteLoopHero } from './components/BiteLoopHero';
import { CampusDigitalTwin } from './components/CampusDigitalTwin';
import { RescueRadar } from './components/RescueRadar';
import { VendorCommandCentre } from './components/VendorCommandCentre';
import { SmartMealPlanner } from './components/SmartMealPlanner';
import { ImpactDashboard } from './components/ImpactDashboard';
import { SellerRetailerPortal } from './components/SellerRetailerPortal';
import { RescueDropModal } from './components/RescueDropModal';
import { DemoScenarioModal } from './components/DemoScenarioModal';
import { Toast } from './components/Toast';
import Dither from './components/Dither';
import MagicBento from './components/MagicBento';
import { Mail, Lock, X } from 'lucide-react';

const LoginModal: React.FC = () => {
  const { isAuthenticated, login, logout } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('student@vit.edu');
  const [password, setPassword] = useState('demo123');
  const [name, setName] = useState('Student');

  if (isAuthenticated) {
    return (
      <div className="fixed right-5 top-24 z-50 hidden md:block">
        <button
          onClick={logout}
          className="rounded-full border border-slate-700 bg-slate-900/80 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-300"
        >
          Logout
        </button>
      </div>
    );
  }

  return (
    <>
      <div className="fixed right-5 top-24 z-50 hidden md:block">
        <button
          onClick={() => setIsOpen(true)}
          className="rounded-full border border-violet-500/30 bg-violet-500/10 px-3 py-1.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-violet-200"
        >
          Login
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/75 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: 18, opacity: 0, scale: 0.96 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 12, opacity: 0, scale: 0.96 }}
              className="w-full max-w-md rounded-[28px] border border-slate-800 bg-slate-900/95 p-6 shadow-[0_30px_80px_rgba(2,6,23,0.9)]"
            >
              <div className="mb-5 flex items-center justify-between">
                <div>
                  <div className="text-[10px] uppercase tracking-[0.2em] text-violet-300">Budget-Bite</div>
                  <h3 className="mt-2 text-2xl font-black text-white">Student login</h3>
                </div>
                <button onClick={() => setIsOpen(false)} className="rounded-full border border-slate-700 p-2 text-slate-300">
                  <X className="h-4 w-4" />
                </button>
              </div>

              <div className="space-y-4">
                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Name</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <input value={name} onChange={(e) => setName(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="Your name" />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Email</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
                    <Mail className="h-4 w-4 text-slate-500" />
                    <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="you@campus.edu" />
                  </div>
                </label>

                <label className="block">
                  <span className="mb-2 block text-xs uppercase tracking-[0.18em] text-slate-500">Password</span>
                  <div className="flex items-center gap-2 rounded-2xl border border-slate-800 bg-slate-950/70 px-3 py-2.5">
                    <Lock className="h-4 w-4 text-slate-500" />
                    <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} className="w-full bg-transparent text-sm text-white outline-none placeholder:text-slate-500" placeholder="••••••••" />
                  </div>
                </label>

                <button
                  onClick={() => {
                    const ok = login(email, password, name);
                    if (ok) setIsOpen(false);
                  }}
                  className="w-full rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-4 py-3 text-sm font-bold text-white shadow-[0_0_24px_rgba(139,92,246,0.35)]"
                >
                  Sign in
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

const DashboardContent: React.FC = () => {
  const { activeTab } = useApp();

  return (
    <div className="min-h-screen bg-slate-950 text-white selection:bg-violet-500 selection:text-white font-sans">
      <div className="fixed inset-0 z-0 overflow-hidden opacity-90">
        <Dither
          waveSpeed={0.05}
          waveFrequency={3}
          waveAmplitude={0.4}
          waveColor={[0.64, 0.4, 1.0]}
          colorNum={5}
          pixelSize={2}
          disableAnimation={false}
          enableMouseInteraction={true}
          mouseRadius={1}
          style={{ width: '100%', height: '100%' }}
        />
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0 opacity-100"
        style={{
          backgroundImage: `
            radial-gradient(circle at 10% 10%, rgba(168,85,247,0.18), transparent 30%),
            radial-gradient(circle at 80% 20%, rgba(244,114,182,0.12), transparent 28%),
            radial-gradient(circle at 60% 80%, rgba(59,130,246,0.12), transparent 28%),
            linear-gradient(rgba(148,163,184,0.03) 1px, transparent 1px),
            linear-gradient(90deg, rgba(148,163,184,0.03) 1px, transparent 1px)
          `,
          backgroundSize: '100% 100%, 100% 100%, 100% 100%, 42px 42px, 42px 42px',
        }}
      />

      <Header />
      <LoginModal />
      <Toast />

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 pb-10 pt-6 xl:pl-72 xl:pr-6">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -18 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
          >
            {activeTab === 'biteloop' && (
              <>
                <BiteLoopHero />
                <MagicBento
                  textAutoHide={true}
                  enableStars={true}
                  enableSpotlight={true}
                  enableBorderGlow={true}
                  enableTilt={true}
                  enableMagnetism={true}
                  clickEffect={true}
                  spotlightRadius={300}
                  particleCount={12}
                  glowColor="168, 85, 247"
                />
              </>
            )}
            {activeTab === 'seller-portal' && <SellerRetailerPortal />}
            {activeTab === 'digital-twin' && <CampusDigitalTwin />}
            {activeTab === 'rescue-radar' && <RescueRadar />}
            {activeTab === 'kitchen-command' && <VendorCommandCentre />}
            {activeTab === 'smart-meal' && <SmartMealPlanner />}
            {activeTab === 'sustainability' && <ImpactDashboard />}
          </motion.div>
        </AnimatePresence>
      </main>

      <RescueDropModal />
      <DemoScenarioModal />

      <footer className="relative z-10 border-t border-slate-900/80 bg-slate-950/80 px-4 py-6 text-center text-xs text-slate-500 xl:pl-72">
        <div className="mx-auto max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">Budget-Bite • BiteLoop AI</span>
            <span>•</span>
            <span className="font-mono text-emerald-400">Predict • Prevent • Rescue</span>
          </div>

          <div>
            <span>DevJams 2026 Review 1 — 30% MVP Prototype • VIT Vellore Campus</span>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <DashboardContent />
    </AppProvider>
  );
}
