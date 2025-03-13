import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2, Send } from "lucide-react";

interface ChatInputProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  username: string;
}

export default function ChatInput({ onSendMessage, isLoading, username }: ChatInputProps) {
  const [message, setMessage] = useState("");
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage("");
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 w-full">
      <div className="flex items-center">
        <div className="text-sm font-medium mr-2 text-primary">
          <span className="opacity-70">Messaging as:</span> {username}
        </div>
      </div>
      <div className="flex items-center gap-2 w-full">
        <Input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type your message..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button 
          type="submit" 
          size="icon" 
          disabled={isLoading || message.trim() === ""}
          className="bg-secondary hover:bg-secondary-500 text-white"
        >
          {isLoading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
        </Button>
      </div>
    </form>
  );
}