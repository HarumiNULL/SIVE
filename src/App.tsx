/*import { useState } from 'react'*/
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";

/*import Navbar from "./pages/Navbar";*/
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import ViewOptical from './pages/ViewOptical';
import EditOptical from './pages/EditOptical';

function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/viewO" element={<ViewOptical/>}/>/* vista de opticas para dueño optica */
        <Route path="/editO" element={<EditOptical/>}/>
      
      </Routes>
    </Router>
    </>
  );
}

export default App
