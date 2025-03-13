import { format } from "date-fns";
import UserAvatar from "./UserAvatar";
import type { MessageWithUser } from "@shared/schema";

interface ChatMessageProps {
  message: MessageWithUser;
  isCurrentUser: boolean;
}

export default function ChatMessage({ message, isCurrentUser }: ChatMessageProps) {
  const formattedTime = format(new Date(message.timestamp), "h:mm a");
  
  // Determine message layout based on sender
  if (isCurrentUser) {
    return (
      <div className="flex items-start justify-end">
        <div className="mr-2 max-w-xs sm:max-w-md">
          <div className="flex items-baseline justify-end">
            <span className="mr-2 text-xs text-primary-500">{formattedTime}</span>
            <span className="font-medium text-sm">You</span>
          </div>
          <div className="bg-secondary text-white p-3 rounded-lg rounded-tr-none mt-1 text-sm break-words">
            {message.content}
          </div>
        </div>
        <UserAvatar username={message.username} isCurrentUser={true} />
      </div>
    );
  }
  
  return (
    <div className="flex items-start">
      <UserAvatar username={message.username} />
      <div className="ml-2 max-w-xs sm:max-w-md">
        <div className="flex items-baseline">
          <span className="font-medium text-sm">{message.username}</span>
          <span className="ml-2 text-xs text-primary-500">{formattedTime}</span>
        </div>
        <div className="bg-neutral p-3 rounded-lg rounded-tl-none mt-1 text-sm break-words">
          {message.content}
        </div>
      </div>
    </div>
  );
}
