import { users, type User, type InsertUser, messages, type Message, type InsertMessage, type MessageWithUser } from "@shared/schema";

export interface IStorage {
  // User methods
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: number): Promise<boolean>;
  makeUserAdmin(id: number): Promise<User | undefined>;
  
  // Message methods
  getMessages(): Promise<MessageWithUser[]>;
  createMessage(message: InsertMessage): Promise<Message>;
  deleteUserMessages(userId: number): Promise<boolean>;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private messages: Map<number, Message>;
  private userIdCounter: number;
  private messageIdCounter: number;

  constructor() {
    this.users = new Map();
    this.messages = new Map();
    this.userIdCounter = 1;
    this.messageIdCounter = 1;
  }

  // User methods
  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: number): Promise<boolean> {
    return this.users.delete(id);
  }

  async makeUserAdmin(id: number): Promise<User | undefined> {
    const user = await this.getUser(id);
    if (user) {
      const updatedUser: User = { ...user, isAdmin: true };
      this.users.set(id, updatedUser);
      return updatedUser;
    }
    return undefined;
  }

  // Message methods
  async getMessages(): Promise<MessageWithUser[]> {
    const messagesWithUser: MessageWithUser[] = [];
    
    for (const message of this.messages.values()) {
      const user = await this.getUser(message.userId);
      if (user) {
        messagesWithUser.push({
          ...message,
          username: user.username,
        });
      }
    }
    
    // Sort messages by timestamp
    return messagesWithUser.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  }

  async createMessage(insertMessage: InsertMessage): Promise<Message> {
    const id = this.messageIdCounter++;
    const timestamp = new Date();
    const message: Message = { ...insertMessage, id, timestamp };
    this.messages.set(id, message);
    return message;
  }

  async deleteUserMessages(userId: number): Promise<boolean> {
    // Find all messages from the user
    const userMessages = Array.from(this.messages.entries())
      .filter(([_, message]) => message.userId === userId);
    
    // Delete each message
    userMessages.forEach(([id, _]) => {
      this.messages.delete(id);
    });
    
    return true;
  }
}

export const storage = new MemStorage();
