import { Switch, Route, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Login from "@/pages/Login";
import Register from "@/pages/Register";
import Chat from "@/pages/Chat";
import Admin from "@/pages/Admin";
import { useEffect, useState } from "react";
import { apiRequest } from "./lib/queryClient";
import { useToast } from "@/hooks/use-toast";

function Router() {
  const [location, setLocation] = useLocation();
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const res = await apiRequest("GET", "/api/me");
        if (res.ok) {
          setIsAuthenticated(true);
        } else {
          setIsAuthenticated(false);
        }
      } catch (error) {
        setIsAuthenticated(false);
      }
    };

    checkAuth();
  }, [location]);

  // Redirect function for authenticated routes
  const redirectIfNotAuthenticated = (Component: React.ComponentType) => {
    if (isAuthenticated === null) {
      // Still loading auth status
      return null;
    }
    
    if (!isAuthenticated) {
      // Redirect to login
      setLocation("/login");
      return null;
    }
    
    return <Component />;
  };

  // Redirect function for unauthenticated routes
  const redirectIfAuthenticated = (Component: React.ComponentType) => {
    if (isAuthenticated === null) {
      // Still loading auth status
      return null;
    }
    
    if (isAuthenticated) {
      // Redirect to chat
      setLocation("/chat");
      return null;
    }
    
    return <Component />;
  };

  return (
    <Switch>
      <Route path="/" component={() => redirectIfAuthenticated(Home)} />
      <Route path="/login" component={() => redirectIfAuthenticated(Login)} />
      <Route path="/register" component={() => redirectIfAuthenticated(Register)} />
      <Route path="/chat" component={() => redirectIfNotAuthenticated(Chat)} />
      <Route path="/admin" component={() => redirectIfNotAuthenticated(Admin)} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router />
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;
