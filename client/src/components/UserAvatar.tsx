import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  username: string;
  isCurrentUser?: boolean;
}

// Function to get avatar color based on username
const getAvatarColor = (username: string): string => {
  const colors = [
    "bg-secondary",
    "bg-accent",
    "bg-green-500",
    "bg-purple-500",
    "bg-blue-500",
    "bg-orange-500",
  ];
  
  // Generate a consistent index based on username
  let hash = 0;
  for (let i = 0; i < username.length; i++) {
    hash = username.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const index = Math.abs(hash) % colors.length;
  return colors[index];
};

// Function to get initials from username
const getInitials = (username: string): string => {
  return username.charAt(0).toUpperCase();
};

export default function UserAvatar({ username, isCurrentUser = false }: UserAvatarProps) {
  const avatarColor = isCurrentUser ? "bg-secondary" : getAvatarColor(username);
  
  return (
    <Avatar className={`h-8 w-8 ${avatarColor} text-white flex-shrink-0`}>
      <AvatarFallback className="text-sm">
        {getInitials(username)}
      </AvatarFallback>
    </Avatar>
  );
}
