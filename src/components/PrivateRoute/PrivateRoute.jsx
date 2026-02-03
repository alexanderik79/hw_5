import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PrivateRoute = () => {
  // Дістаємо токен із нашого Zustand-сейфа
  const token = useAuthStore((state) => state.token);

  // Якщо токен є — показуємо внутрішні сторінки (Outlet)
  // Якщо токена немає — примусово відправляємо на сторінку /login
  return token ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;