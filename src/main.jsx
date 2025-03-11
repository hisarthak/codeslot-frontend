import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { AuthProvider } from './authContext.jsx';
import ProjectRoutes from './Routes.jsx';
import { BrowserRouter as Router } from 'react-router-dom';
import { SearchProvider } from './searchContext';  // Import the SearchContext


ReactDOM.createRoot(document.getElementById('root')).render(
  <AuthProvider>
    <Router>
      <SearchProvider> {/* Wrap with SearchProvider */}
        <ProjectRoutes />
      </SearchProvider>
    </Router>
  </AuthProvider>
);
