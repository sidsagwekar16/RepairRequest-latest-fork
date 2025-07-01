import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "./hooks/useAuth";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/Dashboard";
import RequestForm from "@/pages/RequestForm";
import BuildingRequestForm from "@/pages/BuildingRequestForm";
import RequestDetail from "@/pages/RequestDetail";
import MyRequests from "@/pages/MyRequests";
import AssignedRequests from "@/pages/AssignedRequests";
import ManageRequests from "@/pages/ManageRequests";
import Reports from "@/pages/Reports";
import RoomHistory from "@/pages/RoomHistory";

import AdminOrganizations from "@/pages/AdminOrganizations";
import AdminBuildingsFacilities from "@/pages/AdminBuildingsFacilities";
import AdminUsers from "@/pages/AdminUsers";
import LandingPage from "@/pages/LandingPage";
import HeroLanding from "@/pages/HeroLanding";
import Login from "@/pages/Login";
import Pricing from "@/pages/Pricing";
import Support from "@/pages/Support";
import About from "@/pages/About";
import Contact from "@/pages/Contact";
import Privacy from "@/pages/Privacy";
import Terms from "@/pages/Terms";
import FAQ from "@/pages/FAQ";
import Navbar from "@/components/layout/Navbar";
import Sidebar from "@/components/layout/Sidebar";
import MobileNav from "@/components/layout/MobileNav";
import { useState, useEffect } from "react";
import { Helmet } from "react-helmet-async";

function AppContent() {
  const { user, isLoading, isAuthenticated } = useAuth();
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState(false);
  const [location] = useLocation();
  
  const toggleMobileSidebar = () => {
    setIsMobileSidebarOpen(!isMobileSidebarOpen);
  };

  // Get organization name for dynamic branding
  const organizationName = user?.role === 'super_admin' 
    ? 'SchoolHouse Logistics' 
    : user?.organizationName || 'RepairRequest';
  
  // Handle public routes
  if (location === "/landing") {
    return <LandingPage />;
  }
  if (location === "/pricing") {
    return <Pricing />;
  }
  if (location === "/support") {
    return <Support />;
  }
  if (location === "/about") {
    return <About />;
  }
  if (location === "/contact") {
    return <Contact />;
  }
  if (location === "/privacy") {
    return <Privacy />;
  }
  if (location === "/terms") {
    return <Terms />;
  }
  if (location === "/faq") {
    return <FAQ />;
  }
  
  if (isLoading) {
    return (
      <div className="flex h-screen w-full items-center justify-center">
        <div className="h-16 w-16 animate-spin rounded-full border-b-2 border-t-2 border-primary"></div>
      </div>
    );
  }
  
  if (!isAuthenticated) {
    return <Login />;
  }
  
  return (
    <div className="flex flex-col h-screen">
      <Helmet>
        <title>{organizationName} - Facilities Management System</title>
        <meta name="description" content={`${organizationName}'s comprehensive facilities management system for repair requests and facility scheduling.`} />
      </Helmet>
      <Navbar toggleMobileSidebar={toggleMobileSidebar} user={user} />
      
      <div className="flex flex-1 overflow-hidden">
        <Sidebar 
          isMobileOpen={isMobileSidebarOpen} 
          closeMobileSidebar={() => setIsMobileSidebarOpen(false)} 
          user={user} 
        />
        
        <main className="flex-1 relative z-0 overflow-y-auto bg-gray-100">
          <Switch>
            <Route path="/" component={Dashboard} />
            <Route path="/new-facilities-request" component={RequestForm} />
            <Route path="/new-building-request" component={BuildingRequestForm} />
            <Route path="/requests/:id">
              {params => <RequestDetail id={params.id} />}
            </Route>
            <Route path="/my-requests" component={MyRequests} />
            <Route path="/assigned-requests" component={AssignedRequests} />
            <Route path="/manage-requests" component={ManageRequests} />
            <Route path="/reports" component={Reports} />
            <Route path="/room-history" component={RoomHistory} />

            <Route path="/admin/organizations" component={AdminOrganizations} />
            <Route path="/admin/buildings-facilities" component={AdminBuildingsFacilities} />
            <Route path="/admin/users" component={AdminUsers} />
            <Route component={NotFound} />
          </Switch>
        </main>
      </div>
      
      <MobileNav user={user} />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <AppContent />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
