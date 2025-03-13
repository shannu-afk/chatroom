import { apiRequest } from "./queryClient";

export interface User {
  id: number;
  username: string;
  isAdmin?: boolean;
}

export async function register(username: string, password: string): Promise<User> {
  const response = await apiRequest("POST", "/api/register", { username, password });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Registration failed");
  }
  
  return response.json();
}

export async function login(username: string, password: string): Promise<User> {
  const response = await apiRequest("POST", "/api/login", { username, password });
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Login failed");
  }
  
  return response.json();
}

export async function logout(): Promise<void> {
  const response = await apiRequest("POST", "/api/logout");
  
  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.message || "Logout failed");
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const response = await apiRequest("GET", "/api/me");
    
    if (!response.ok) {
      return null;
    }
    
    return response.json();
  } catch (error) {
    return null;
  }
}
