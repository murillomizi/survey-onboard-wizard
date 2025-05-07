
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LogIn, Loader, AtSign } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

interface LoginFormProps {
  onClose: () => void;
  className?: string;
  switchToRegister: () => void;
}

export function LoginForm({ onClose, className, switchToRegister }: LoginFormProps) {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }
    
    setIsLoading(true);
    
    try {
      const { error } = await signIn(email, password);
      
      if (error) {
        toast.error(error.message || "Login failed");
        return;
      }
      
      toast.success("Login successful");
      navigate("/dashboard");
      onClose();
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Error during login");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className={`p-6 bg-minimal-white rounded-lg shadow-lg ${className}`}>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Login</h2>
        <button 
          onClick={onClose}
          className="text-minimal-gray-500 hover:text-minimal-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="email" className="block text-sm font-medium mb-1">
            Email
          </Label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <AtSign className="h-4 w-4 text-gray-400" />
            </div>
            <Input
              id="email"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="pl-10 w-full"
            />
          </div>
        </div>
        
        <div>
          <Label htmlFor="password" className="block text-sm font-medium mb-1">
            Password
          </Label>
          <Input
            id="password"
            type="password"
            placeholder="********"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full"
          />
        </div>
        
        <div className="text-right">
          <button
            type="button"
            onClick={() => toast.info("Feature coming soon")}
            className="text-sm text-gray-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>
        
        <Button
          type="submit"
          disabled={isLoading}
          className="w-full bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
        >
          {isLoading ? (
            <>
              <Loader className="mr-2 h-4 w-4 animate-spin" />
              Logging in...
            </>
          ) : (
            "Login"
          )}
        </Button>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-600">
            Don't have an account?{" "}
            <button
              type="button"
              onClick={switchToRegister}
              className="text-minimal-black font-medium hover:underline"
            >
              Sign up
            </button>
          </p>
        </div>
      </form>
    </div>
  );
}
