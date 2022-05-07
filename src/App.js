import { Route, Routes } from 'react-router-dom';
import ChatsPage from './pages/ChatsPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Routes>
        <Route exact path='/' element={<HomePage />} />
        <Route exact path='/chats' element={<ChatsPage />} />
      </Routes>
    </div>
  );
}

export default App;
