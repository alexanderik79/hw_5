import { useState } from 'react'; // Додали стан
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Container, 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Card, 
  CardContent, 
  Alert,
  InputAdornment, // Додали для ока
  IconButton     // Додали для ока
} from '@mui/material';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility'; // Додали іконку
import VisibilityOff from '@mui/icons-material/VisibilityOff'; // Додали іконку

import { loginSchema } from '../../utils/validationSchemas';
import { useAuthStore } from '../../store/authStore';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();
  
  // Стейт для перемикання видимості пароля
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data) => {
    if (data.username === 'test' && data.password === 'password') {
      login('fake-token-123', data.username);
      navigate('/');
    } else {
      alert("Невірний логін або пароль!");
    }
  };

  return (
    <Container maxWidth="xs">
      <Box sx={{ mt: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <Card sx={{ width: '100%', boxShadow: 3, borderRadius: 2 }}>
          <CardContent sx={{ p: 4 }}>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
              <LoginIcon color="primary" sx={{ fontSize: 40, mb: 1 }} />
              <Typography variant="h5" component="h1" fontWeight="bold">
                Вхід у систему
              </Typography>
            </Box>

            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register("username")}
                label="Логін"
                fullWidth
                margin="normal"
                error={!!errors.username}
                helperText={errors.username?.message}
                variant="outlined"
              />
              
              <TextField
                {...register("password")}
                label="Пароль"
                // Тип змінюється залежно від стейту
                type={showPassword ? 'text' : 'password'} 
                fullWidth
                margin="normal"
                error={!!errors.password}
                helperText={errors.password?.message}
                variant="outlined"
                // ОСЬ ТУТ МИ ДОДАЄМО ОКО:
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton
                        onClick={() => setShowPassword(!showPassword)}
                        edge="end"
                      >
                        {showPassword ? <VisibilityOff /> : <Visibility />}
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                sx={{ mt: 3, mb: 2, py: 1.5 }}
              >
                Увійти
              </Button>
            </form>

            <Alert severity="info" sx={{ mt: 2 }}>
              Підказка: <strong>test</strong> / <strong>password</strong>
            </Alert>
          </CardContent>
        </Card>
      </Box>
    </Container>
  );
};

export default LoginPage;