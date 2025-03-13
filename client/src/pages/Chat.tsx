import { useEffect, useRef, useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useLocation } from "wouter";
import Header from "@/components/Header";
import ChatMessage from "@/components/ChatMessage";
import ChatInput from "@/components/ChatInput";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2, LogOut } from "lucide-react";
import type { MessageWithUser } from "@shared/schema";

export default function Chat() {
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [_, setLocation] = useLocation();
  const { toast } = useToast();

  // Get current user
  const { data: currentUser, isLoading: isLoadingUser } = useQuery<{
    id: number;
    username: string;
    isAdmin?: boolean;
  }>({
    queryKey: ["/api/me"],
  });

  // Fetch messages with polling
  const { 
    data: messages, 
    isLoading: isLoadingMessages,
    error: messagesError 
  } = useQuery<MessageWithUser[]>({
    queryKey: ["/api/messages"],
    refetchInterval: 2000, // Poll every 2 seconds
  });

  // Logout mutation
  const logoutMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/logout");
    },
    onSuccess: () => {
      toast({
        title: "Logged out",
        description: "You have been logged out successfully",
      });
      setLocation("/login");
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to log out",
        variant: "destructive",
      });
    },
  });
  
  // Make admin mutation
  const makeAdminMutation = useMutation({
    mutationFn: async () => {
      return await apiRequest("POST", "/api/make-first-admin");
    },
    onSuccess: (data: any) => {
      toast({
        title: "Success!",
        description: data?.message || "You are now an admin!",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/me"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to make you an admin",
        variant: "destructive",
      });
    },
  });

  // Send message mutation
  const sendMessageMutation = useMutation({
    mutationFn: async (content: string) => {
      return await apiRequest("POST", "/api/messages", { content });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/messages"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to send message",
        variant: "destructive",
      });
    },
  });

  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = (content: string) => {
    if (content.trim() === "") return;
    sendMessageMutation.mutate(content);
  };

  const handleLogout = () => {
    logoutMutation.mutate();
  };
  
  const handleMakeAdmin = () => {
    makeAdminMutation.mutate();
  };

  if (isLoadingUser) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showLogout={true} onLogout={handleLogout} isAdmin={currentUser?.isAdmin} />
      
      <div className="flex-1 container mx-auto p-4 max-w-5xl">
        {!currentUser?.isAdmin && (
          <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded-md p-4 flex items-center justify-between">
            <div>
              <h3 className="font-medium text-yellow-800">Want to try admin features?</h3>
              <p className="text-sm text-yellow-600">
                Click the button to make yourself an admin user and gain access to admin panel.
              </p>
            </div>
            <Button 
              onClick={handleMakeAdmin} 
              disabled={makeAdminMutation.isPending} 
              className="bg-yellow-600 text-white hover:bg-yellow-700"
            >
              {makeAdminMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Loading...
                </>
              ) : (
                "Make Me Admin"
              )}
            </Button>
          </div>
        )}
        
        <Card className="flex flex-col h-[calc(100vh-9rem)] shadow-lg overflow-hidden">
          {/* Chat header */}
          <div className="p-4 border-b border-neutral flex justify-between items-center bg-primary text-white">
            <div>
              <h2 className="font-bold flex items-center gap-2">
                <span className="text-lg"># Public Chat</span>
                <span className="text-xs bg-white/20 px-2 py-0.5 rounded-full">
                  {messages?.length || 0} messages
                </span>
              </h2>
              <p className="text-sm text-white/80">Welcome to the public chatroom</p>
            </div>
            <Button variant="secondary" size="sm" onClick={handleLogout} className="text-white">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          </div>
          
          {/* Messages container */}
          <div className="flex-1 p-4 overflow-y-auto bg-background space-y-4">
            {isLoadingMessages ? (
              <div className="flex justify-center items-center h-full">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : messagesError ? (
              <div className="flex justify-center items-center h-full text-red-500">
                Error loading messages. Please refresh.
              </div>
            ) : messages && messages.length > 0 ? (
              messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message}
                  isCurrentUser={message.username === currentUser?.username}
                />
              ))
            ) : (
              <div className="flex justify-center items-center h-full text-primary-500">
                No messages yet. Be the first to say something!
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>
          
          {/* Message input */}
          <div className="p-4 border-t border-neutral bg-white">
            <ChatInput 
              onSendMessage={handleSendMessage} 
              isLoading={sendMessageMutation.isPending}
              username={currentUser?.username || ''}
            />
          </div>
        </Card>
      </div>
    </div>
  );
}
