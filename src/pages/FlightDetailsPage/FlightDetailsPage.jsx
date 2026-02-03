import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';
import { 
  Container, Paper, Typography, Box, TextField, 
  Button, Checkbox, FormControlLabel, Grid, Divider, Alert 
} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';

import { bookingSchema } from '../../utils/validationSchemas';
import Loader from '../../components/Loader/Loader';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const { data: flight, isLoading, isError } = useQuery({
    queryKey: ['flight', id],
    queryFn: async () => {
      const response = await axios.get(`https://694eda01b5bc648a93c1705e.mockapi.io/flights/${id}`);
      return response.data;
    },
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = (data) => {
    console.log("Дані бронювання:", data);
    alert(`Успішно! Квиток для ${data.fullName} заброньовано. Перевірте пошту ${data.email}`);
    navigate('/flights');
  };

  if (isLoading) return <Loader message="Завантажуємо деталі рейсу..." />;
  if (isError || !flight) return (
    <Container sx={{ mt: 4 }}><Alert severity="error">Рейс не знайдено!</Alert></Container>
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Button 
        startIcon={<ArrowBackIcon />} 
        onClick={() => navigate(-1)} 
        sx={{ mb: 3 }}
      >
        Назад до списку
      </Button>

      <Grid container spacing={4}>
        {/* ІНФОРМАЦІЯ ПРО РЕЙС */}
        <Grid item xs={12} md={5}>
          <Paper elevation={3} sx={{ p: 3, height: '100%', borderRadius: 2, bgcolor: '#f8f9fa' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Деталі рейсу
            </Typography>
            <Typography variant="subtitle1" color="primary" gutterBottom>
              {flight.airline} • {flight.flightNumber}
            </Typography>
            
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <FlightTakeoffIcon color="action" />
              <Box>
                <Typography variant="body2" color="textSecondary">Виліт</Typography>
                <Typography variant="h6">{flight.origin}</Typography>
                <Typography variant="body2">{flight.departureDate} о {flight.departureTime}</Typography>
              </Box>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 3 }}>
              <FlightLandIcon color="action" />
              <Box>
                <Typography variant="body2" color="textSecondary">Прибуття</Typography>
                <Typography variant="h6">{flight.destination}</Typography>
              </Box>
            </Box>

            <Divider sx={{ my: 2 }} />
            
            <Typography variant="h4" color="success.main" fontWeight="bold">
              ${flight.price}
            </Typography>
          </Paper>
        </Grid>

        {/* ФОРМА БРОНЮВАННЯ */}
        <Grid item xs={12} md={7}>
          <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">
              Дані пасажира
            </Typography>
            <form onSubmit={handleSubmit(onSubmit)}>
              <TextField
                {...register('fullName')}
                label="Прізвище та ім'я"
                fullWidth
                margin="normal"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
              />
              <TextField
                {...register('email')}
                label="Електронна пошта"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
              />
              
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={<Checkbox {...register('confirmAgreement')} />}
                  label="Я підтверджую правильність даних та згоден з умовами"
                />
                {errors.confirmAgreement && (
                  <Typography color="error" variant="caption" display="block">
                    {errors.confirmAgreement.message}
                  </Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 4, py: 1.5, textTransform: 'none', fontSize: '1.1rem' }}
              >
                Підтвердити бронювання
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FlightDetailsPage;