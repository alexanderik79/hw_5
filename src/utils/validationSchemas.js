import { z } from 'zod';

// Схема для валідації форми логіну
export const loginSchema = z.object({
  username: z.string().min(1, "Логін обов'язковий"),
  password: z.string().min(6, "Пароль має бути не менше 6 символів"),
});

// Схема для пошуку рейсів (знадобиться пізніше)
export const searchSchema = z.object({
  origin: z.string().min(1, "Вкажіть місто відправлення"),
  destination: z.string().min(1, "Вкажіть місто прибуття"),
  departureDate: z.string().min(1, "Оберіть дату"),
});

// Схема для бронювання (знадобиться пізніше)
export const bookingSchema = z.object({
  fullName: z.string().min(3, "Введіть повне ім'я"),
  email: z.string().email("Невірний формат email"),
  confirmAgreement: z.literal(true, {
    errorMap: () => ({ message: "Потрібна згода з умовами" }),
  }),
});