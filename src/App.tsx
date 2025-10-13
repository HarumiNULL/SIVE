/*import { useState } from 'react'*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ViewOptical from './pages/ViewOptical';
import EditOptical from './pages/EditOptical';
import Prueba from './pages/prueba';
import ProtectedRoute from './pages/ProtectedRoute';
import { AuthProvider } from "./pages/AuthContext";

function App() {

  return (
    <>
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<ProtectedRoute>
              <Register />
            </ProtectedRoute>} />
            <Route path="/viewO" element={<ProtectedRoute>
              <ViewOptical />
            </ProtectedRoute>} />
            <Route path="/editO" element={<ProtectedRoute>
              <EditOptical />
            </ProtectedRoute>} />
            <Route path="/prueba" element={<ProtectedRoute>
              <Prueba />
            </ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App
