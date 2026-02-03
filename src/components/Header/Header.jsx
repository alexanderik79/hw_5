import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import FlightTakeoffIcon from '@mui/icons-material/FlightTakeoff';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const Header = () => {
  const { token, user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <AppBar position="static" sx={{ backgroundColor: '#1976d2' }}>
      <Container maxWidth="lg">
        <Toolbar disableGutters>
          {/* Логотип */}
          <FlightTakeoffIcon sx={{ display: { xs: 'none', md: 'flex' }, mr: 1 }} />
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontWeight: 700,
              color: 'inherit',
              textDecoration: 'none',
              flexGrow: 1
            }}
          >
            FLY-TICKETS
          </Typography>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {token && (
              <>
                <Typography variant="body1" sx={{ color: 'white' }}>
                  Привіт, <strong>{user}</strong>
                </Typography>
                <Button 
                  color="inherit" 
                  onClick={handleLogout}
                  variant="outlined"
                  sx={{ borderColor: 'white' }}
                >
                  Вийти
                </Button>
              </>
            )}
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Header;