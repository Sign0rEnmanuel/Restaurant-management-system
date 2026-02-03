import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

function App() {
  return (
    <Router>
      <div className="app">
        <h1>Restaurant Management System</h1>
        <Routes>
          <Route path="/" element={<h2>Home Page</h2>} />
          <Route path="/login" element={<h2>Login Page</h2>} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;