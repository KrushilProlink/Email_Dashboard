/* eslint-disable no-undef */
import React, { } from 'react';
import { Navigate, Route, Routes, useNavigate } from 'react-router-dom';
// routes
import { ToastContainer } from 'react-toastify';
import Routers from './routes';

// theme
// components
import { StyledChart } from './components/chart';
import ScrollToTop from './components/scroll-to-top';
import LoginPage from './pages/LoginPage';
import 'react-toastify/dist/ReactToastify.css';
import ThemeProvider from './theme';
import './assets/style.css'

// ----------------------------------------------------------------------

export default function App() {

  const token = localStorage.getItem('token');

  // eslint-disable-next-line react-hooks/exhaustive-deps, prefer-const
  const user = JSON.parse(localStorage.getItem('user'))
  useNavigate()

  return (
    <ThemeProvider>
      <ScrollToTop />
      <StyledChart />
      <ToastContainer />
      {token && user?.role ? (
         <Routers /> 
      ) : (
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="*" element={<Navigate to="/login" />} />

        </Routes>
      )}
    </ThemeProvider>
  );
}
