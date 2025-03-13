import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertUserSchema, insertMessageSchema } from "@shared/schema";
import { fromZodError } from "zod-validation-error";
import bcrypt from "bcryptjs";
import session from "express-session";
import MemoryStore from "memorystore";

export async function registerRoutes(app: Express): Promise<Server> {
  // Configure session middleware
  const SessionStore = MemoryStore(session);
  
  app.use(
    session({
      secret: process.env.SESSION_SECRET || "chatmaster-secret",
      resave: false,
      saveUninitialized: false,
      cookie: { secure: process.env.NODE_ENV === "production", maxAge: 86400000 }, // 24 hours
      store: new SessionStore({
        checkPeriod: 86400000, // prune expired entries every 24h
      }),
    })
  );

  // Authentication middleware
  const requireAuth = (req: Request, res: Response, next: () => void) => {
    if (req.session && req.session.userId) {
      next();
    } else {
      res.status(401).json({ message: "Unauthorized" });
    }
  };
  
  // Admin middleware
  const requireAdmin = async (req: Request, res: Response, next: () => void) => {
    if (!req.session || !req.session.userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.session.userId as number);
    if (!user || !user.isAdmin) {
      return res.status(403).json({ message: "Forbidden: Admin access required" });
    }
    
    next();
  };

  // User registration
  app.post("/api/register", async (req, res) => {
    try {
      const validatedData = insertUserSchema.parse(req.body);
      
      // Check if user already exists
      const existingUser = await storage.getUserByUsername(validatedData.username);
      if (existingUser) {
        return res.status(409).json({ message: "Username already taken" });
      }
      
      // Hash password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(validatedData.password, salt);
      
      // Create user with hashed password
      const user = await storage.createUser({
        username: validatedData.username,
        password: hashedPassword,
        isAdmin: validatedData.isAdmin || false,
      });
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(201).json(userWithoutPassword);
    } catch (error) {
      if (error instanceof Error) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });

  // User login
  app.post("/api/login", async (req, res) => {
    try {
      const { username, password } = req.body;
      
      // Find user
      const user = await storage.getUserByUsername(username);
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Verify password
      const isValidPassword = await bcrypt.compare(password, user.password);
      if (!isValidPassword) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      
      // Set session
      req.session.userId = user.id;
      
      // Return user without password
      const { password: _, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // User logout
  app.post("/api/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Failed to logout" });
      }
      res.clearCookie("connect.sid");
      res.status(200).json({ message: "Logged out successfully" });
    });
  });

  // Get current user
  app.get("/api/me", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Return user without password
      const { password, ...userWithoutPassword } = user;
      res.status(200).json(userWithoutPassword);
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Get messages
  app.get("/api/messages", requireAuth, async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.status(200).json(messages);
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  // Create message
  app.post("/api/messages", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      
      // Validate message content
      const validatedData = insertMessageSchema.parse({
        userId,
        content: req.body.content,
      });
      
      // Create message
      const message = await storage.createMessage(validatedData);
      
      // Get user for the response
      const user = await storage.getUser(userId);
      
      // Return message with username
      if (user) {
        res.status(201).json({
          ...message,
          username: user.username,
        });
      } else {
        res.status(201).json(message);
      }
    } catch (error) {
      if (error instanceof Error) {
        const validationError = fromZodError(error);
        res.status(400).json({ message: validationError.message });
      } else {
        res.status(500).json({ message: "An unexpected error occurred" });
      }
    }
  });

  // ADMIN ROUTES
  
  // Special route to make the first user an admin (development only)
  app.post("/api/make-first-admin", requireAuth, async (req, res) => {
    try {
      const userId = req.session.userId as number;
      const user = await storage.getUser(userId);
      
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Make this user an admin
      const updatedUser = await storage.makeUserAdmin(userId);
      
      if (updatedUser) {
        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json({
          ...userWithoutPassword,
          message: "You are now an admin!"
        });
      } else {
        res.status(500).json({ message: "Failed to update user" });
      }
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  // Get all users (admin only)
  app.get("/api/admin/users", requireAdmin, async (req, res) => {
    try {
      const users = await storage.getAllUsers();
      // Remove passwords from response
      const usersWithoutPasswords = users.map(user => {
        const { password, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });
      
      res.status(200).json(usersWithoutPasswords);
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  // Delete a user (admin only)
  app.delete("/api/admin/users/:id", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Don't allow admin to delete themselves
      if (userId === req.session.userId) {
        return res.status(400).json({ message: "Cannot delete your own account" });
      }
      
      // Delete user's messages first
      await storage.deleteUserMessages(userId);
      
      // Delete the user
      const deleted = await storage.deleteUser(userId);
      
      if (deleted) {
        res.status(200).json({ message: "User deleted successfully" });
      } else {
        res.status(500).json({ message: "Failed to delete user" });
      }
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });
  
  // Make user an admin (admin only)
  app.patch("/api/admin/users/:id/make-admin", requireAdmin, async (req, res) => {
    try {
      const userId = parseInt(req.params.id);
      
      if (isNaN(userId)) {
        return res.status(400).json({ message: "Invalid user ID" });
      }
      
      // Check if user exists
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      
      // Check if user is already an admin
      if (user.isAdmin) {
        return res.status(400).json({ message: "User is already an admin" });
      }
      
      // Make user an admin
      const updatedUser = await storage.makeUserAdmin(userId);
      
      if (updatedUser) {
        // Remove password from response
        const { password, ...userWithoutPassword } = updatedUser;
        res.status(200).json(userWithoutPassword);
      } else {
        res.status(500).json({ message: "Failed to update user" });
      }
    } catch (error) {
      res.status(500).json({ message: "An unexpected error occurred" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
