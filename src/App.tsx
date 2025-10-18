/*import { useState } from 'react'*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from './pages/Login';
import Prueba from './pages/Prueba';
import Register from './pages/Register';
import Home from './pages/Home';
import ViewOptical from './pages/ViewOptical';
import EditOptical from './pages/EditOptical';
import ProtectedRoute from './pages/ProtectedRoute';
import { AuthProvider } from "./pages/AuthContext";
import Test from "./pages/Test";

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
            <Route path="/viewO/:id" element={<ProtectedRoute>
              <ViewOptical />
            </ProtectedRoute>} />
            <Route path="/editO/:id" element={<ProtectedRoute>
              <EditOptical />
            </ProtectedRoute>} />
            <Route path="/prueba" element={<ProtectedRoute>
              <Prueba />
            </ProtectedRoute>} />
             <Route path="/test" element={<ProtectedRoute>
              <Test/></ProtectedRoute>}/>
          </Routes>
        </Router>
      </AuthProvider>
   </>
  );
}

export default App
