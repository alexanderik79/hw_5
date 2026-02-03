import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
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
import { updateFlightSeats } from '../../api/flightService';
import Loader from '../../components/Loader/Loader';

const FlightDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: flight, isLoading, isError } = useQuery({
    queryKey: ['flight', id],
    queryFn: async () => {
      const response = await axios.get(`https://694eda01b5bc648a93c1705e.mockapi.io/flights/${id}`);
      return response.data;
    },
  });

  const mutation = useMutation({
    mutationFn: updateFlightSeats,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['flights'] });
      alert('Бронювання успішне! Кількість місць оновлено.');
      navigate('/flights');
    },
    onError: (error) => {
      console.error(error);
      alert('Помилка сервера при спробі забронювати місце.');
    }
  });

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(bookingSchema),
  });

  const onSubmit = (data) => {
    if (flight.availableSeats > 0) {
      mutation.mutate({ id: flight.id, currentSeats: flight.availableSeats });
    } else {
      alert("На жаль, вільних місць на цей рейс більше немає.");
    }
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

      {/* alignItems="stretch" змушує колонки бути однакової висоти */}
      <Grid container spacing={4} alignItems="stretch">
        {/* КАРТКА РЕЙСУ */}
        <Grid item xs={12} md={5} sx={{ display: 'flex' }}>
          <Paper elevation={3} sx={{ p: 3, width: '100%', borderRadius: 2, bgcolor: '#f8f9fa', display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">Квиток</Typography>
            <Typography variant="subtitle1" color="primary" fontWeight="bold">
              {flight.airline}
            </Typography>
            <Divider sx={{ my: 2 }} />
            
            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FlightTakeoffIcon color="action" />
                <Typography variant="body1"><strong>{flight.origin}</strong></Typography>
              </Box>
              <Typography variant="body2" sx={{ ml: 4 }}>{flight.departureDate} о {flight.departureTime}</Typography>
            </Box>

            <Box sx={{ mb: 3 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <FlightLandIcon color="action" />
                <Typography variant="body1"><strong>{flight.destination}</strong></Typography>
              </Box>
            </Box>

            <Box sx={{ mt: 'auto' }}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h4" color="success.main" fontWeight="bold">${flight.price}</Typography>
              <Typography variant="body2" color="textSecondary">Вільних місць: {flight.availableSeats}</Typography>
            </Box>
          </Paper>
        </Grid>

        {/* ФОРМА */}
        <Grid item xs={12} md={7} sx={{ display: 'flex' }}>
          <Paper elevation={3} sx={{ p: 3, width: '100%', borderRadius: 2, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="h5" gutterBottom fontWeight="bold">Бронювання</Typography>
            <form onSubmit={handleSubmit(onSubmit)} style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
              <TextField
                {...register('fullName')}
                label="Прізвище та ім'я"
                fullWidth
                margin="normal"
                error={!!errors.fullName}
                helperText={errors.fullName?.message}
                disabled={mutation.isPending}
              />
              <TextField
                {...register('email')}
                label="Email"
                fullWidth
                margin="normal"
                error={!!errors.email}
                helperText={errors.email?.message}
                disabled={mutation.isPending}
              />
              
              <Box sx={{ mt: 1 }}>
                <FormControlLabel
                  control={<Checkbox {...register('confirmAgreement')} disabled={mutation.isPending} />}
                  label="Я погоджуюсь з правилами"
                />
                {errors.confirmAgreement && (
                  <Typography color="error" variant="caption" display="block">{errors.confirmAgreement.message}</Typography>
                )}
              </Box>

              <Button
                type="submit"
                variant="contained"
                fullWidth
                size="large"
                sx={{ mt: 'auto', py: 1.5, mb: 1 }}
                disabled={mutation.isPending || flight.availableSeats <= 0}
              >
                {mutation.isPending ? 'Обробка...' : 'Забронювати зараз'}
              </Button>
            </form>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default FlightDetailsPage;