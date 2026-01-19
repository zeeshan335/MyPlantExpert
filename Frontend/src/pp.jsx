import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navigation from "./components/Navigation";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Contact from "./components/Contact";
import InsectIdentification from "./components/InsectIdentification";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import PlantIdentification from "./components/PlantIdentification";
import DiseaseDetection from "./components/DiseaseDetection";
import PlantDatabase from "./components/PlantDatabase";
import PlantCare from "./components/PlantCare";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navigation />
          <div className="main-content">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/contact" element={<Contact />} />
              <Route
                path="/insect-identification"
                element={<InsectIdentification />}
              />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/plant-identification"
                element={<PlantIdentification />}
              />
              <Route path="/disease-detection" element={<DiseaseDetection />} />
              <Route path="/plant-database" element={<PlantDatabase />} />
              <Route path="/plant-care" element={<PlantCare />} />
            </Routes>
          </div>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
