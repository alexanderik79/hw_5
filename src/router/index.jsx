import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import PrivateRoute from '../components/PrivateRoute/PrivateRoute';
import LoginPage from '../pages/LoginPage/LoginPage';
import FlightsPage from '../pages/FlightsPage/FlightsPage';
import FlightDetailsPage from '../pages/FlightDetailsPage/FlightDetailsPage';



export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // Головна обгортка з Header та Outlet
    children: [
      {
        path: "login",
        element: <LoginPage />, // Сюди можна всім
      },
      {
        element: <PrivateRoute />, // Наш "охоронець" загортає наступні маршрути
        children: [
          {
            index: true, // Це головна сторінка за замовчуванням (/)
            element: <FlightsPage />,
          },
          {
            path: "flights",
            element: <FlightsPage />,
          },
          {
            path: "flights/:id", // Деталі конкретного рейсу
            element: <FlightDetailsPage />,
          },
        ],
      },
      {
        path: "*",
        element: <div>Сторінка 404: Тут нічого немає</div>,
      },
    ],
  },
]);