import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import ProjectDetail from './pages/ProjectDetail';
import CreateProject from './pages/CreateProject';
import Profile from './pages/Profile';
import Requests from './pages/Requests';
import { FlaskConical } from 'lucide-react';

function PrivateRoute({ children }) {
  const { token, loading } = useAuth();

  if (loading) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh', gap: '12px', color: 'var(--text-secondary)' }}>
        <FlaskConical size={28} style={{ animation: 'pulse-soft 1.5s ease-in-out infinite', color: 'var(--primary-500)' }} />
        <span style={{ fontSize: '14px' }}>Loading…</span>
      </div>
    );
  }

  return token ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <>
      <Navbar />
      <main style={{ flex: 1 }}>{children}</main>
    </>
  );
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Private Routes */}
          <Route
            path="/dashboard"
            element={
              <PrivateRoute>
                <AppLayout><Dashboard /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects"
            element={
              <PrivateRoute>
                <AppLayout><Projects /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/new"
            element={
              <PrivateRoute>
                <AppLayout><CreateProject /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/projects/:id"
            element={
              <PrivateRoute>
                <AppLayout><ProjectDetail /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/profile"
            element={
              <PrivateRoute>
                <AppLayout><Profile /></AppLayout>
              </PrivateRoute>
            }
          />
          <Route
            path="/requests"
            element={
              <PrivateRoute>
                <AppLayout><Requests /></AppLayout>
              </PrivateRoute>
            }
          />

          {/* Redirect root */}
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="*" element={<Navigate to="/dashboard" />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
