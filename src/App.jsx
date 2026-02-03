import { Outlet } from 'react-router-dom';
import Header from './components/Header/Header'; // Імпортуємо наш новий компонент

function App() {
  return (
    <div className="app-container">
      {/* Тепер Header буде завжди зверху */}
      <Header />
      
      <main style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
        <Outlet />
      </main>
    </div>
  );
}

export default App;