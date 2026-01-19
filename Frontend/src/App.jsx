import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Navbar from "./components/Navbar";
import SubNavbar from "./components/SubNavbar";
import Footer from "./components/Footer";
import Home from "./components/Home";
import About from "./components/About";
import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import Dashboard from "./components/Dashboard";
import PlantIdentification from "./components/PlantIdentification";
import DiseaseDetection from "./components/DiseaseDetection";
import InsectIdentification from "./components/InsectIdentification";
import CrossBreed from "./components/CrossBreed";
import ExpertConsultation from "./components/ExpertConsultation";
import PlantDatabase from "./components/PlantDatabase";
import PlantCare from "./components/PlantCare";
import CommunityPage from "./components/CommunityPage";
import Marketplace from "./components/Marketplace";
import Checkout from "./components/Checkout";
import Profile from "./components/Profile";
import Contact from "./components/Contact";
import ExpertLogin from "./pages/ExpertLogin";
import ExpertDashboard from "./pages/ExpertDashboard";
import AdminLogin from "./components/AdminLogin";
import AdminDashboard from "./components/AdminDashboard";
import AdminProductManagement from "./components/AdminProductManagement";
import AdminOrders from "./components/AdminOrders";
import SellerRegistration from "./pages/SellerRegistration";
import SellerLogin from "./pages/SellerLogin";
import SellerDashboard from "./pages/SellerDashboard";
import CustomerSupport from "./components/CustomerSupport";
import KnowledgeVault from "./components/KnowledgeVault";
import BreedingPlanner from "./components/BreedingPlanner";
import HybridOutcome from "./components/HybridOutcome";
import SuccessProbability from "./components/SuccessProbability";
import GrowthConditions from "./components/GrowthConditions";
import BreedingLogbook from "./components/BreedingLogbook";
import BreedingWorkflow from "./components/BreedingWorkflow";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <SubNavbar />
          <main className="main-content">
            <Routes>
              {/* Public Routes */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/contact" element={<Contact />} />

              {/* Dashboard Routes */}
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/plant-identification"
                element={<PlantIdentification />}
              />
              <Route path="/disease-detection" element={<DiseaseDetection />} />
              <Route
                path="/insect-identification"
                element={<InsectIdentification />}
              />
              <Route path="/cross-breed" element={<CrossBreed />} />
              <Route
                path="/expert-consultation"
                element={<ExpertConsultation />}
              />
              <Route path="/plant-database" element={<PlantDatabase />} />
              <Route path="/plant-care" element={<PlantCare />} />
              <Route path="/community" element={<CommunityPage />} />
              <Route path="/marketplace" element={<Marketplace />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/knowledge-vault" element={<KnowledgeVault />} />
              <Route path="/breeding-planner" element={<BreedingPlanner />} />
              <Route
                path="/breeding-planner/outcome"
                element={<HybridOutcome />}
              />
              <Route
                path="/breeding-planner/probability"
                element={<SuccessProbability />}
              />
              <Route
                path="/breeding-planner/conditions"
                element={<GrowthConditions />}
              />
              <Route
                path="/breeding-planner/logbook"
                element={<BreedingLogbook />}
              />
              <Route
                path="/breeding-planner/workflow"
                element={<BreedingWorkflow />}
              />

              {/* Expert Routes */}
              <Route path="/expert-login" element={<ExpertLogin />} />
              <Route path="/expert-dashboard" element={<ExpertDashboard />} />

              {/* Admin Routes */}
              <Route path="/admin-login" element={<AdminLogin />} />
              <Route path="/admin-dashboard" element={<AdminDashboard />} />
              <Route
                path="/admin/products"
                element={<AdminProductManagement />}
              />
              <Route path="/admin/orders" element={<AdminOrders />} />

              {/* Seller Routes */}
              <Route
                path="/seller-registration"
                element={<SellerRegistration />}
              />
              <Route path="/seller-login" element={<SellerLogin />} />
              <Route path="/seller-dashboard" element={<SellerDashboard />} />
            </Routes>
          </main>
          <Footer />
          <CustomerSupport />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
