import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import './App.css';
import RequestForm from './components/requests';
import RequestHistory from './components/history';

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <nav className="bg-blue-600 text-white shadow-md">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="space-x-4">
              <Link to="/" className="hover:underline">Home</Link>
              <Link to="/history" className="hover:underline">History</Link>
            </div>
          </div>
        </nav>
        
        <main className="container mx-auto px-4 py-6">
          <Routes>
            <Route path="/" element={<RequestForm />} />
            <Route path="/history" element={<RequestHistory />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
