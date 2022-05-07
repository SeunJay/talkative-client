import { Route } from 'react-router-dom';
import ChatsPage from './pages/ChatsPage';
import HomePage from './pages/HomePage';
import './App.css';

function App() {
  return (
    <div className='App'>
      <Route exact path='/' component={HomePage} />
      <Route exact path='/chats' component={ChatsPage} />
    </div>
  );
}

export default App;
