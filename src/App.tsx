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
import { ROL_DUENO, ROL_USUARIO } from "./config";
import GestionUser from "./pages/Admin/GestionUser";
import AddProduct from "./pages/opticalOwner/AddProduct";
import ViewGraphics from "./pages/opticalOwner/ViewGraphics";


import { ROL_ADMIN } from "./config";
import RedirectToMyOptical from "./pages/opticalOwner/RedirectToMyOptical";
function App() {

  return (
    <>

      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/HomeAdmin" element={<ProtectedRoute>
              <HomeAdmin />
            </ProtectedRoute>} />

            <Route path="/HomeAdmin" element={<ProtectedRoute required_rol={ROL_ADMIN}><HomeAdmin /></ProtectedRoute>} />

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
            <Route path="/graphics" element={<ProtectedRoute required_rol={ROL_DUENO}><ViewGraphics/></ProtectedRoute>} />
            <Route path="/listProb" element={<ProtectedRoute><ListProbability/></ProtectedRoute>}/> 
            <Route path="/listTest" element={<ProtectedRoute><ListTest/></ProtectedRoute>} />
            <Route path="/registerO" element={<ProtectedRoute><RegisterOptical/></ProtectedRoute>}/>
            <Route path="/registerO/:id_optical" element={<RegisterOptical/>} />
            <Route path="/test/:id" element={<ProtectedRoute><Test /></ProtectedRoute>} /> 
            <Route path="/my-optical" element={<RedirectToMyOptical />} />
            <Route path="/listProb" element={<ProtectedRoute>
              <ListProbability/>
            </ProtectedRoute>}/>
            <Route path="/listProb" element={<ProtectedRoute><ListProbability/></ProtectedRoute>}/>
            <Route path="/listTest" element={<ProtectedRoute>
              <ListTest />
            </ProtectedRoute>} />
            <Route path="/addProduct/:id" element={<ProtectedRoute required_rol={ROL_DUENO}><AddProduct/></ProtectedRoute>}/>
            <Route path="/test/:id" element={<ProtectedRoute required_rol={ROL_USUARIO}><Test /></ProtectedRoute>} />
            <Route path="/test/:id" element={<ProtectedRoute><Test /></ProtectedRoute>} />
            <Route path="/GestionUser" element={<ProtectedRoute><GestionUser /></ProtectedRoute>}/>
            <Route path="/regisO" element={<ProtectedRoute required_rol={ROL_USUARIO}><RegisterOptical /></ProtectedRoute>} />
          </Routes>
          
        </Router>
      </AuthProvider>
    </>
  );
}

export default App
