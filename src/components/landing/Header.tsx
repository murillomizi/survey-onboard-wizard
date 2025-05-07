
import React from "react";
import { Link } from "react-router-dom";
import { LogIn, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import Logo from "@/components/ui/logo";

const Header = () => {
  return (
    <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
      <Logo size="md" />
      <div className="flex items-center gap-4">
        <Button size="sm" variant="outline" asChild>
          <Link to="/" className="flex items-center gap-1.5">
            <LogIn className="h-3.5 w-3.5" />
            <span>Sign In</span> 
          </Link>
        </Button>
        <Button size="sm" asChild>
          <Link to="/" className="flex items-center gap-1.5">
            <UserPlus className="h-3.5 w-3.5" />
            <span>Sign Up</span> 
          </Link>
        </Button>
      </div>
    </nav>
  );
};

export default Header;
