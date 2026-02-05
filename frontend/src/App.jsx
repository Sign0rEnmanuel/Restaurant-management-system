import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Menu from './pages/Menu.jsx';
import Tables from './pages/Tables.jsx';
import Orders from './pages/Orders.jsx';
import Users from './pages/Users.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path='/dashboard' element={ <ProtectedRoute> <Dashboard /> </ProtectedRoute> } />
        <Route path='/menu' element={ <ProtectedRoute> <Menu /> </ProtectedRoute> } />
        <Route path='/tables' element={ <ProtectedRoute> <Tables /> </ProtectedRoute> } />
        <Route path='/orders' element={ <ProtectedRoute> <Orders /> </ProtectedRoute> } />
        <Route path='/users' element={ <ProtectedRoute> <Users /> </ProtectedRoute> } />
      </Routes>
    </Router>
  );
}

export default App;