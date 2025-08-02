import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import SchedulePage from './pages/SchedulePage';
import UpdatesPage from './pages/UpdatesPage';
import ReviewsPage from './pages/ReviewsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage'; // <-- NEW IMPORT
import ProtectedRoute from './components/ProtectedRoute';

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} /> {/* <-- NEW ROUTE */}
      <Route path="/" element={
        <ProtectedRoute>
          <Layout />
        </ProtectedRoute>
      }>
        <Route index element={<SchedulePage />} />
        <Route path="schedule" element={<SchedulePage />} />
        <Route path="updates" element={<UpdatesPage />} />
        <Route path="reviews" element={<ReviewsPage />} />
      </Route>
    </Routes>
  );
}
