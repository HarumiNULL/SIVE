/*import { useState } from 'react'*/
import { BrowserRouter as Router, Routes, Route} from "react-router-dom";
import "./App.css";

/*import Navbar from "./pages/Navbar";*/
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import View_optical from './pages/ViewOptical';
import Test from "./pages/Test";
function App() {

  return (
    <>
    <Router>
      <Routes>
        <Route path="/" element={<Home/>}/>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/viewO" element={<View_optical/>}/>/* vista de opticas para dueño optica */
        <Route path="/test" element={<Test/>}/>
      </Routes>
    </Router>
    </>
  );
}

export default App
