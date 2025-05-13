
import React from "react";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

interface NavigationProps {
  onOpenLogin: () => void;
  onOpenRegister: () => void;
}

const Navigation: React.FC<NavigationProps> = ({
  onOpenLogin,
  onOpenRegister,
}) => {
  return (
    <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
      <Logo size="md" />
      <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
};

export default Navigation;
