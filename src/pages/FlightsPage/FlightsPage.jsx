import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { 
  Container, Grid, Card, CardContent, Typography, 
  Button, TextField, Box, Paper, Divider 
} from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import FlightLandIcon from '@mui/icons-material/FlightLand';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { searchSchema } from '../../utils/validationSchemas';
import { fetchFlights } from '../../api/flightService';
import { Link } from 'react-router-dom';
import Loader from '../../components/Loader/Loader';

const FlightsPage = () => {
  const [searchParams, setSearchParams] = useState({});
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(searchSchema),
  });

  const { data: flights, isLoading, isError } = useQuery({
    queryKey: ['flights', searchParams],
    queryFn: () => fetchFlights(searchParams),
  });

  const onSearch = (data) => setSearchParams(data);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* ПАНЕЛЬ ПОШУКУ */}
      <Paper elevation={3} sx={{ p: 3, mb: 4, borderRadius: 2 }}>
        <Typography variant="h5" gutterBottom sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <SearchIcon color="primary" /> Пошук рейсів
        </Typography>
        <form onSubmit={handleSubmit(onSearch)}>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} md={3}>
              <TextField 
                {...register('origin')} 
                label="Звідки" 
                fullWidth 
                placeholder="Напр. London"
                error={!!errors.origin}
                helperText={errors.origin?.message}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField 
                {...register('destination')} 
                label="Куди" 
                fullWidth 
                placeholder="Напр. Paris"
                error={!!errors.destination}
                helperText={errors.destination?.message}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField 
                {...register('departureDate')} 
                type="date" 
                fullWidth 
                InputLabelProps={{ shrink: true }} 
                label="Дата вильоту"
                error={!!errors.departureDate}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <Button 
                type="submit" 
                variant="contained" 
                fullWidth 
                size="large" 
                startIcon={<SearchIcon />}
                sx={{ height: '56px', fontWeight: 'bold' }}
              >
                Знайти
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>

      {/* СПИСОК РЕЙСІВ */}
      {isLoading ? (
        <Loader message="Шукаємо найкращі пропозиції..." />
      ) : isError ? (
        <Box sx={{ mt: 4 }}><Typography color="error" align="center">Сталася помилка при завантаженні даних.</Typography></Box>
      ) : (
        <Grid container spacing={3} alignItems="stretch">
          {flights?.map((flight) => (
            <Grid item xs={12} sm={6} md={4} key={flight.id} sx={{ display: 'flex' }}>
              <Card 
                sx={{ 
                  width: '100%', 
                  display: 'flex', 
                  flexDirection: 'column', 
                  transition: '0.3s', 
                  '&:hover': { boxShadow: 10, transform: 'translateY(-5px)' },
                  borderRadius: 3,
                  border: '1px solid #e0e0e0'
                }}
              >
                <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column', p: 3 }}>
                  {/* Хедер картки */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, minHeight: 40 }}>
                    <Typography variant="subtitle1" color="primary" fontWeight="bold">
                      {flight.airline}
                    </Typography>
                    <Typography variant="caption" sx={{ bgcolor: '#f0f0f0', px: 1, py: 0.5, borderRadius: 1, height: 'fit-content' }}>
                      {flight.flightNumber}
                    </Typography>
                  </Box>

                  {/* Маршрут - ВЕРТИКАЛЬНИЙ (щоб ширина була стабільною) */}
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5, mb: 3 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FlightTakeoffIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Звідки</Typography>
                        <Typography variant="body1" fontWeight="600">{flight.origin}</Typography>
                      </Box>
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                      <FlightLandIcon fontSize="small" color="action" />
                      <Box>
                        <Typography variant="caption" color="textSecondary" display="block">Куди</Typography>
                        <Typography variant="body1" fontWeight="600">{flight.destination}</Typography>
                      </Box>
                    </Box>
                  </Box>

                  <Divider sx={{ mb: 2 }} />

                  {/* Час та Дата */}
                  <Grid container spacing={1} sx={{ mb: 2 }}>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <EventIcon fontSize="inherit" color="disabled" />
                        <Typography variant="body2">{flight.departureDate}</Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTimeIcon fontSize="inherit" color="disabled" />
                        <Typography variant="body2">{flight.departureTime}</Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Ціна притиснута до низу */}
                  <Box sx={{ mt: 'auto', pt: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h5" sx={{ color: '#2e7d32', fontWeight: 'bold' }}>
                      ${flight.price}
                    </Typography>
                    <Typography variant="caption" color="textSecondary">
                      {flight.availableSeats} місць
                    </Typography>
                  </Box>
                </CardContent>

                <Box sx={{ p: 2, pt: 0 }}>
                  <Button 
                    component={Link} 
                    to={`/flights/${flight.id}`} 
                    variant="contained" 
                    fullWidth
                    sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 'bold', py: 1 }}
                  >
                    Забронювати
                  </Button>
                </Box>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}

      {flights?.length === 0 && !isLoading && (
        <Paper sx={{ p: 5, textAlign: 'center', mt: 4, bgcolor: '#fafafa' }}>
          <Typography variant="h6" color="textSecondary">
            На жаль, рейсів не знайдено. Спробуйте змінити параметри пошуку.
          </Typography>
        </Paper>
      )}
    </Container>
  );
};

export default FlightsPage;