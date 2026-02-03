import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  token: localStorage.getItem('authToken') || null,
  // Додаємо поле для імені користувача
  user: localStorage.getItem('userName') || null,

  login: (newToken, userName) => {
    localStorage.setItem('authToken', newToken);
    localStorage.setItem('userName', userName); // Зберігаємо ім'я в браузері
    set({ token: newToken, user: userName });
  },

  logout: () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userName');
    set({ token: null, user: null });
  },
}));