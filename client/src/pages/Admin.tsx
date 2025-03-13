import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import Header from "@/components/Header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Loader2, Shield, Trash, MessageCircle, Settings, Users } from "lucide-react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { User } from "@/lib/auth";
import type { MessageWithUser } from "@shared/schema";

interface AdminUser extends User {
  isAdmin: boolean;
}

export default function Admin() {
  const { toast } = useToast();
  const [selectedUser, setSelectedUser] = useState<AdminUser | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  
  // Current user query
  const { data: currentUser, isLoading: isCurrentUserLoading } = useQuery<AdminUser>({
    queryKey: ["/api/me"],
  });
  
  // All users query
  const { 
    data: users, 
    isLoading: isUsersLoading,
    error: usersError,
  } = useQuery<AdminUser[]>({
    queryKey: ["/api/admin/users"],
    enabled: !!currentUser?.isAdmin,
  });
  
  // Get messages query
  const {
    data: messages,
    isLoading: isMessagesLoading,
    error: messagesError
  } = useQuery<MessageWithUser[]>({
    queryKey: ["/api/messages"],
    enabled: !!currentUser?.isAdmin,
    refetchInterval: 5000, // Poll every 5 seconds
  });
  
  // Delete user mutation
  const deleteUserMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("DELETE", `/api/admin/users/${userId}`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
      setDeleteDialogOpen(false);
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    },
  });
  
  // Make admin mutation
  const makeAdminMutation = useMutation({
    mutationFn: async (userId: number) => {
      return await apiRequest("PATCH", `/api/admin/users/${userId}/make-admin`);
    },
    onSuccess: () => {
      toast({
        title: "Success",
        description: "User is now an admin",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/admin/users"] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to make user an admin",
        variant: "destructive",
      });
    },
  });
  
  const handleDeleteUser = (user: AdminUser) => {
    setSelectedUser(user);
    setDeleteDialogOpen(true);
  };
  
  const confirmDeleteUser = () => {
    if (selectedUser) {
      deleteUserMutation.mutate(selectedUser.id);
    }
  };
  
  const handleMakeAdmin = (user: AdminUser) => {
    makeAdminMutation.mutate(user.id);
  };
  
  // If current user is not admin, show access denied
  if (currentUser && !currentUser.isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showLogout={true} isAdmin={false} />
        <div className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <Card className="w-full max-w-md">
            <CardHeader>
              <CardTitle className="text-2xl text-red-500">Access Denied</CardTitle>
              <CardDescription>
                You do not have permission to access the admin panel.
              </CardDescription>
            </CardHeader>
          </Card>
        </div>
      </div>
    );
  }
  
  // Show loading
  if (isCurrentUserLoading || isUsersLoading) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Header showLogout={true} isAdmin={!!currentUser?.isAdmin} />
        <div className="flex-1 container mx-auto p-4 flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Header showLogout={true} isAdmin={true} />
      
      <div className="flex-1 container mx-auto p-4">
        <Card className="shadow-lg">
          <CardHeader className="bg-primary text-white">
            <CardTitle className="text-2xl">Admin Panel</CardTitle>
            <CardDescription className="text-white/80">
              Manage users and their permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <Tabs defaultValue="users" className="mb-6">
              <TabsList className="grid w-full grid-cols-2 mb-4">
                <TabsTrigger value="users" className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  Users
                </TabsTrigger>
                <TabsTrigger value="messages" className="flex items-center gap-2">
                  <MessageCircle className="h-4 w-4" />
                  Messages
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="users">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">User Management</h2>
                  <div className="bg-primary-50 p-2 rounded-md text-sm">
                    <span className="font-medium text-primary">{users?.length || 0}</span> total users
                  </div>
                </div>
            
                <div className="mb-6 bg-neutral-50 p-4 rounded-md">
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <Shield className="h-4 w-4 mr-2 text-primary" />
                    Admin Settings
                  </h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    As an admin, you can manage users and their permissions. Use the controls below to add or remove admin privileges.
                  </p>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
                    <div className="bg-white p-3 rounded-md border border-primary/20 shadow-sm">
                      <div className="text-xs text-neutral-500 uppercase font-medium">Total Users</div>
                      <div className="text-2xl font-semibold text-primary mt-1">{users?.length || 0}</div>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-primary/20 shadow-sm">
                      <div className="text-xs text-neutral-500 uppercase font-medium">Admins</div>
                      <div className="text-2xl font-semibold text-primary mt-1">
                        {users?.filter(user => user.isAdmin).length || 0}
                      </div>
                    </div>
                    <div className="bg-white p-3 rounded-md border border-primary/20 shadow-sm">
                      <div className="text-xs text-neutral-500 uppercase font-medium">Regular Users</div>
                      <div className="text-2xl font-semibold text-primary mt-1">
                        {users?.filter(user => !user.isAdmin).length || 0}
                      </div>
                    </div>
                  </div>
                </div>
                
                {usersError ? (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    Failed to load users. Please try again.
                  </div>
                ) : users && users.length > 0 ? (
                  <Table>
                    <TableHeader className="bg-neutral">
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell>{user.id}</TableCell>
                          <TableCell>
                            <span className="font-medium">{user.username}</span>
                            {user.id === currentUser?.id && (
                              <span className="ml-2 text-xs bg-neutral text-primary-500 px-2 py-0.5 rounded-full">
                                (You)
                              </span>
                            )}
                          </TableCell>
                          <TableCell>
                            {user.isAdmin ? (
                              <span className="inline-flex items-center text-primary px-2 py-1 rounded bg-primary-50">
                                <Shield className="h-3 w-3 mr-1" />
                                Admin
                              </span>
                            ) : (
                              <span className="text-neutral-600">User</span>
                            )}
                          </TableCell>
                          <TableCell className="text-right">
                            {!user.isAdmin && (
                              <Button 
                                variant="outline"
                                size="sm"
                                onClick={() => handleMakeAdmin(user)}
                                disabled={makeAdminMutation.isPending}
                                className="mr-2"
                              >
                                {makeAdminMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <Shield className="h-3 w-3 mr-1" />
                                )}
                                Make Admin
                              </Button>
                            )}
                            
                            {user.id !== currentUser?.id && (
                              <Button 
                                variant="destructive"
                                size="sm"
                                onClick={() => handleDeleteUser(user)}
                                disabled={deleteUserMutation.isPending}
                              >
                                {deleteUserMutation.isPending ? (
                                  <Loader2 className="h-3 w-3 animate-spin mr-1" />
                                ) : (
                                  <Trash className="h-3 w-3 mr-1" />
                                )}
                                Delete
                              </Button>
                            )}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                ) : (
                  <div className="text-center p-8 text-neutral-600">
                    No users found
                  </div>
                )}
              </TabsContent>
              
              <TabsContent value="messages">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Message Management</h2>
                  <div className="bg-primary-50 p-2 rounded-md text-sm">
                    <span className="font-medium text-primary">Message Monitoring</span>
                  </div>
                </div>
                
                <div className="mb-6 bg-neutral-50 p-4 rounded-md">
                  <h3 className="text-md font-semibold mb-2 flex items-center">
                    <MessageCircle className="h-4 w-4 mr-2 text-primary" />
                    Chat Monitoring
                  </h3>
                  <p className="text-sm text-neutral-500 mb-3">
                    As an admin, you can monitor all messages in the chat. You can see which users are active and moderate content if needed.
                  </p>
                </div>
                
                {/* Messages list component */}
                <div className="border rounded-md overflow-hidden">
                  <div className="bg-primary p-3 text-white font-medium">
                    Recent Messages ({messages?.length || 0})
                  </div>
                  <div className="p-4 max-h-[400px] overflow-y-auto">
                    {isMessagesLoading ? (
                      <div className="flex justify-center items-center p-8">
                        <Loader2 className="h-6 w-6 animate-spin text-primary" />
                      </div>
                    ) : messagesError ? (
                      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                        Failed to load messages. Please try again.
                      </div>
                    ) : messages && messages.length > 0 ? (
                      <div className="space-y-4">
                        {messages.map((message) => (
                          <div key={message.id} className="border-b pb-3">
                            <div className="flex justify-between items-center">
                              <div className="font-medium text-primary">
                                {message.username}
                              </div>
                              <div className="text-xs text-neutral-500">
                                {new Date(message.timestamp).toLocaleString()}
                              </div>
                            </div>
                            <div className="mt-1 text-sm">{message.content}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center text-neutral-500 p-4">
                        No messages yet. They will appear here when users start chatting.
                      </div>
                    )}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
      
      {/* Delete confirmation dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Deletion</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete user "{selectedUser?.username}"? 
              This action cannot be undone and will remove all of their messages.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button 
              variant="destructive" 
              onClick={confirmDeleteUser}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending && (
                <Loader2 className="h-4 w-4 animate-spin mr-2" />
              )}
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}