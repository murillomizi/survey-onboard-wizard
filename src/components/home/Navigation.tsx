
import React from "react";
import { LogIn, UserPlus, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";
import { Link } from "react-router-dom";
import { User as SupabaseUser } from "@supabase/supabase-js";

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
        {user && (
          <span className="text-sm text-minimal-gray-600 font-medium hidden md:inline-block">
            Bem-vindo, {user.email?.split('@')[0]}
          </span>
        )}
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
            <Button
              size="sm"
              className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
              onClick={onOpenRegister}
            >
              <UserPlus className="h-3.5 w-3.5 mr-1.5" />
              <span>Sign Up</span>
            </Button>
          </>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/outbound">
              <Button
                size="sm"
                className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
              >
                <User className="h-3.5 w-3.5 mr-1.5" />
                <span>Meus Projetos</span>
              </Button>
            </Link>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;
