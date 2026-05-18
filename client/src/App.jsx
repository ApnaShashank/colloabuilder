import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import LoginPage from "./pages/auth/LoginPage";
import SignupPage from "./pages/auth/SignupPage";
import DashboardLayout from "./layouts/DashboardLayout";
import DashboardOverview from "./pages/dashboard/DashboardOverview";
import LearnPage from "./pages/dashboard/LearnPage";
import PracticePage from "./pages/dashboard/PracticePage";
import ProjectsPage from "./pages/dashboard/ProjectsPage";
import TeamsPage from "./pages/dashboard/TeamsPage";
import LeaderboardPage from "./pages/dashboard/LeaderboardPage";
import PortfolioPage from "./pages/dashboard/PortfolioPage";
import SettingsPage from "./pages/dashboard/SettingsPage";
import AIGuidePage from "./pages/dashboard/AIGuidePage";
import GamePage from "./pages/dashboard/GamePage";
import RoadmapPage from "./pages/dashboard/RoadmapPage";
import HackathonsPage from "./pages/dashboard/HackathonsPage";
import InternshipPage from "./pages/dashboard/InternshipPage";
import CareersPage from "./pages/dashboard/CareersPage";
import DocsPage from "./pages/DocsPage";
import ChangelogPage from "./pages/ChangelogPage";
import AboutPage from "./pages/AboutPage";
import PrivacyPage from "./pages/PrivacyPage";
import TermsPage from "./pages/TermsPage";
import DeployPage from "./pages/dashboard/deploy/DeployPage";
import DeploymentDetailsPage from "./pages/dashboard/deploy/DeploymentDetailsPage";
import NewDeploymentPage from "./pages/dashboard/deploy/NewDeploymentPage";
import ShipyardAuthCallback from "./pages/dashboard/deploy/ShipyardAuthCallback";
import ProjectEditor from "./pages/dashboard/ProjectEditor";
import { Toaster } from "sonner";

// Simple ProtectedRoute component
const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
};

function App() {
  return (
    <Router>
      <Toaster position="top-right" theme="dark" />
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/docs" element={<DocsPage />} />
        <Route path="/changelog" element={<ChangelogPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route path="/terms" element={<TermsPage />} />
        
        {/* Dashboard Routes */}
        <Route 
          path="/dashboard" 
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardOverview />} />
          <Route path="learn" element={<LearnPage />} />
          <Route path="practice" element={<PracticePage />} />
          <Route path="projects" element={<ProjectsPage />} />
          <Route path="projects/:id/edit" element={<ProjectEditor />} />
          <Route path="teams" element={<TeamsPage />} />
          <Route path="leaderboard" element={<LeaderboardPage />} />
          <Route path="portfolio" element={<PortfolioPage />} />
          <Route path="settings" element={<SettingsPage />} />
          <Route path="ai" element={<AIGuidePage />} />
          
          {/* Shipyard Deployment Routes */}
          <Route path="deploy" element={<DeployPage />} />
          <Route path="deploy/:id" element={<DeploymentDetailsPage />} />
          <Route path="deploy/new" element={<NewDeploymentPage />} />
          <Route path="deploy/auth/callback" element={<ShipyardAuthCallback />} />
          
          {/* Placeholders for others */}
          <Route path="game" element={<GamePage />} />
          <Route path="roadmap" element={<RoadmapPage />} />
          <Route path="hackathons" element={<HackathonsPage />} />
          <Route path="internship" element={<InternshipPage />} />
          <Route path="careers" element={<CareersPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
