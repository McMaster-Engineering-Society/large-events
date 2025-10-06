import { createFileRoute } from '@tanstack/react-router';
import AdminDashboard from '../components/AdminDashboard';
import ProtectedRoute from '../components/ProtectedRoute';

export const Route = createFileRoute('/')({
  component: () => (
    <ProtectedRoute>
      <AdminDashboard />
    </ProtectedRoute>
  ),
});
