import React from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Layout } from './components/Layout';
import { Home } from './components/Home';
import { HistoryModule } from './components/History';
import { AIStudio } from './components/AIStudio';
import { Marketplace } from './components/Marketplace';
import { RoutePath } from './types';

// Placeholder components for sections not fully detailed in this specific generation step
const PlaceholderPage: React.FC<{ title: string }> = ({ title }) => (
  <div className="min-h-screen flex items-center justify-center text-center px-4">
    <div>
      <h1 className="font-display text-4xl text-bronze-gold mb-4">{title}</h1>
      <p className="font-serif italic text-gray-400">This portal is currently under construction by our digital artisans.</p>
    </div>
  </div>
);

const App: React.FC = () => {
  return (
    <HashRouter>
      <Layout>
        <Routes>
          <Route path={RoutePath.HOME} element={<Home />} />
          <Route path={RoutePath.HISTORY} element={<HistoryModule />} />
          <Route path={RoutePath.MAP} element={<PlaceholderPage title="Interactive Cultural Map" />} />
          <Route path={RoutePath.AI} element={<AIStudio />} />
          <Route path={RoutePath.COMMUNITY} element={<PlaceholderPage title="Community Hub" />} />
          <Route path={RoutePath.MARKETPLACE} element={<Marketplace />} />
          <Route path="*" element={<Navigate to={RoutePath.HOME} replace />} />
        </Routes>
      </Layout>
    </HashRouter>
  );
};

export default App;
