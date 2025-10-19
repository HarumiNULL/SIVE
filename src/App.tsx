/*import { useState } from 'react'*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from './pages/user/Login';
import Prueba from './pages/opticalOwner/Prueba';
import Register from './pages/user/Register';
import Home from './pages/user/Home'
import ViewOptical from './pages/user/ViewOptical';
import EditOptical from './pages/opticalOwner/EditOptical';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from "./components/AuthContext";
import ListTest from "./pages/user/listTest";
import Test from "./pages/user/Test";
import TestIshihara from "./pages/TestIshihara";
import ListOptical from "./pages/user/listOptical";
import ListProbability from "./pages/user/listProbability";
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
            <Route path="/listOptical" element={<ProtectedRoute> <ListOptical/></ProtectedRoute>}/>
            <Route path="/viewO" element={<ProtectedRoute>
              <ViewOptical />
            </ProtectedRoute>} />
            <Route path="/editO" element={<ProtectedRoute>
              <EditOptical />
            </ProtectedRoute>} />
            <Route path="/prueba" element={<ProtectedRoute>
              <Prueba />
            </ProtectedRoute>} />
            <Route path="/listProb" element={<ProtectedRoute> <ListProbability/> </ProtectedRoute>}/> 
            <Route path="/listTest" element={<ProtectedRoute>
              <ListTest />
            </ProtectedRoute>} />
            <Route path="/test" element={<ProtectedRoute>
              <Test /></ProtectedRoute>} />
            <Route path="/testIshi" element={<ProtectedRoute>
              <TestIshihara />
            </ProtectedRoute>} />
          </Routes>
        </Router>
      </AuthProvider>
    </>
  );
}

export default App
