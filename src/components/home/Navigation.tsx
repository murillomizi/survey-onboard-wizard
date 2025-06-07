
import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import UserDropdownContent from "./UserDropdownContent";

interface NavigationProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
  user: SupabaseUser | null;
}

const Navigation: React.FC<NavigationProps> = ({
  onOpenLogin,
  onOpenRegister,
  user,
}) => {
  return (
    <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <Logo size="md" />
      </div>
      <div className="flex items-center gap-4">
        {!user ? (
          <>
            <Button
              size="sm"
              variant="outline"
              className="border-minimal-gray-300 hover:bg-minimal-gray-100"
              onClick={onOpenLogin}
            >
              <LogIn className="h-3.5 w-3.5 mr-1.5" />
              <span>Login</span>
            </Button>
          
          </>
        ) : (
          <div className="flex items-center gap-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="h-8 w-8 bg-primary/10 hover:bg-primary/20 transition-colors cursor-pointer">
                  <AvatarFallback className="bg-primary/10 text-minimal-black">
                    {user.email?.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <UserDropdownContent user={user} />
            </DropdownMenu>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
