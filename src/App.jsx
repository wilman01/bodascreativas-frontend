import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import { useAuth } from './context/AuthContext.jsx';
import Login from './pages/Login.jsx';
import NotFound from './pages/NotFound.jsx';
import AdminDashboard from './pages/admin/AdminDashboard.jsx';
import AdminWeddingDetail from './pages/admin/AdminWeddingDetail.jsx';
import ClientDashboard from './pages/client/ClientDashboard.jsx';
import ClientWeddingDetail from './pages/client/ClientWeddingDetail.jsx';

function RootRedirect() {
  const { user, loading } = useAuth();
  if (loading) return null;
  if (!user) return <Navigate to="/login" replace />;
  return <Navigate to={user.role === 'admin' ? '/admin' : '/mi-boda'} replace />;
}

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<RootRedirect />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/admin/bodas/:id"
        element={
          <ProtectedRoute allowedRoles={['admin']}>
            <AdminWeddingDetail />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mi-boda"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientDashboard />
          </ProtectedRoute>
        }
      />
      <Route
        path="/mi-boda/:id"
        element={
          <ProtectedRoute allowedRoles={['client']}>
            <ClientWeddingDetail />
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}
