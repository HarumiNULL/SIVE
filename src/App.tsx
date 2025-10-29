/*import { useState } from 'react'*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "./App.css";
import Login from './pages/user/Login';
import Register from './pages/user/Register';
import Home from './pages/user/Home'
import ViewOptical from './pages/user/ViewOptical';
import EditOptical from './pages/opticalOwner/EditOptical';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthProvider } from "./components/AuthContext";
import ListTest from "./pages/user/ListTest";
import Test from "./pages/user/Test";
import ListOptical from "./pages/user/ListOptical";
import ListProbability from "./pages/user/ListProbability";
import RegisterOptical from "./pages/opticalOwner/RegisterOptical";
import HomeAdmin from "./pages/Admin/HomeAdmin";

import GestionUser from "./pages/Admin/GestionUser";

import { ROL_ADMIN } from "./config";
function App() {

  return (
    <>

      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/HomeAdmin" element={<ProtectedRoute>
              <HomeAdmin />
            </ProtectedRoute>} /><Route path="/HomeAdmin" element={<ProtectedRoute required_rol={ROL_ADMIN}><HomeAdmin /></ProtectedRoute>} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/listOptical" element={<ProtectedRoute>
              <ListOptical/>
            </ProtectedRoute>}/>
            <Route path="/viewO/:id" element={<ProtectedRoute>
              <ViewOptical />
            </ProtectedRoute>} />
            <Route path="/editO/:id" element={<ProtectedRoute>
              <EditOptical />
            </ProtectedRoute>} />
            <Route path="/listProb" element={<ProtectedRoute>
              <ListProbability/>
            </ProtectedRoute>}/>
            <Route path="/listProb" element={<ProtectedRoute><ListProbability/></ProtectedRoute>}/>
            <Route path="/listTest" element={<ProtectedRoute>
              <ListTest />
            </ProtectedRoute>} />
            <Route path="/test/:id" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/GestionUser" element={<ProtectedRoute><GestionUser /></ProtectedRoute>}/>
          </Routes>

        </Router>
      </AuthProvider>
    </>
  );
}

export default App
