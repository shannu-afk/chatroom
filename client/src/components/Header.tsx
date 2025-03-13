import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { LogOut, Shield } from "lucide-react";

interface HeaderProps {
  showLogout?: boolean;
  onLogout?: () => void;
  isAdmin?: boolean;
}

export default function Header({ showLogout = false, onLogout, isAdmin = false }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 bg-primary text-white border-b border-primary/20 shadow-sm">
      <div className="container mx-auto px-4 py-3 flex justify-between items-center">
        <Link href="/">
          <div className="flex items-center space-x-2 cursor-pointer">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white w-6 h-6"
            >
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
            </svg>
            <span className="font-bold text-xl">ChatMaster</span>
          </div>
        </Link>
        
        <nav className="hidden md:block">
          <ul className="flex space-x-8">
            <li>
              <Link href="/" className="font-medium text-white hover:text-white/80 transition-colors">
                Home
              </Link>
            </li>
            {showLogout ? (
              <>
                <li>
                  <Link href="/chat" className="font-medium text-white hover:text-white/80 transition-colors">
                    Chat
                  </Link>
                </li>
                {isAdmin && (
                  <li>
                    <Link href="/admin" className="font-medium text-yellow-300 hover:text-yellow-200 transition-colors flex items-center">
                      <Shield className="h-4 w-4 mr-1" />
                      Admin
                    </Link>
                  </li>
                )}
              </>
            ) : (
              <>
                <li>
                  <Link href="/login" className="font-medium text-white hover:text-white/80 transition-colors">
                    Login
                  </Link>
                </li>
                <li>
                  <Link href="/register" className="font-medium text-white hover:text-white/80 transition-colors">
                    Register
                  </Link>
                </li>
              </>
            )}
          </ul>
        </nav>
        
        <div className="flex items-center space-x-4">
          {showLogout && onLogout ? (
            <Button variant="secondary" size="sm" onClick={onLogout} className="text-primary bg-white hover:bg-gray-100">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </Button>
          ) : (
            <Link href={showLogout ? "/chat" : "/login"}>
              <Button className="bg-white hover:bg-gray-100 text-primary">
                {showLogout ? "Go to Chat" : "Login"}
              </Button>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
