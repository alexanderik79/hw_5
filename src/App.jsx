import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header'; // Імпортуємо наш новий компонент
import { Box } from '@mui/material';

function App() {
  return (
    <div className="app-container">
      {/* Тепер Header буде завжди зверху */}
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Box component="main" sx={{ pt: '80px' }}></Box>
        <Outlet />
      </main>
    </div>
  );
}

export default App;