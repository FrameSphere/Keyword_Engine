import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext.jsx';
import Layout        from './components/Layout.jsx';
import Landing       from './pages/Landing.jsx';
import Login         from './pages/Login.jsx';
import Register      from './pages/Register.jsx';
import Dashboard     from './pages/Dashboard.jsx';
import Analyzer      from './pages/Analyzer.jsx';
import Profiles      from './pages/Profiles.jsx';
import History       from './pages/History.jsx';
import Settings      from './pages/Settings.jsx';
import DocsLayout    from './pages/docs/DocsLayout.jsx';
import DocsIndex     from './pages/docs/DocsIndex.jsx';
import DocsQuickstart from './pages/docs/DocsQuickstart.jsx';
import DocsAlgorithm  from './pages/docs/DocsAlgorithm.jsx';
import DocsApi        from './pages/docs/DocsApi.jsx';
import DocsTemplates  from './pages/docs/DocsTemplates.jsx';
import Pricing       from './pages/Pricing.jsx';

function RequireAuth({ children }) {
  const { user, loading } = useAuth();
  if (loading) return <div className="flex h-screen items-center justify-center">
    <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
  </div>;
  return user ? children : <Navigate to="/login" replace />;
}

export default function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/"        element={<Layout><Landing /></Layout>} />
      <Route path="/pricing" element={<Layout><Pricing /></Layout>} />
      <Route path="/login"   element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Docs */}
      <Route path="/docs" element={<Layout><DocsLayout /></Layout>}>
        <Route index          element={<DocsIndex />} />
        <Route path="quickstart"  element={<DocsQuickstart />} />
        <Route path="algorithm"   element={<DocsAlgorithm />} />
        <Route path="api"         element={<DocsApi />} />
        <Route path="templates"   element={<DocsTemplates />} />
      </Route>

      {/* App (Auth required) */}
      <Route path="/app" element={<RequireAuth><Layout app /></RequireAuth>}>
        <Route index           element={<Dashboard />} />
        <Route path="analyze"  element={<Analyzer />} />
        <Route path="profiles" element={<Profiles />} />
        <Route path="history"  element={<History />} />
        <Route path="settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
