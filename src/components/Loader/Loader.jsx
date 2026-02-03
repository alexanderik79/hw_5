import { Box, CircularProgress, Typography } from '@mui/material';

const Loader = ({ message = "Завантаження..." }) => {
  return (
    <Box 
      sx={{ 
        display: 'flex', 
        flexDirection: 'column',
        alignItems: 'center', 
        justifyContent: 'center', 
        height: '50vh',
        gap: 2
      }}
    >
      <CircularProgress size={60} thickness={4} />
      <Typography variant="h6" color="textSecondary">
        {message}
      </Typography>
    </Box>
  );
};

export default Loader;