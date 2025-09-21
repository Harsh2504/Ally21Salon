import React from 'react';
import { AuthProvider } from './context/AuthContext';
import AppRouter from './Router';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <AppRouter />
      <Toaster position="top-right" richColors closeButton />
    </AuthProvider>
  );
}

export default App;
