
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import { LogIn, UserPlus, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Logo from "@/components/ui/logo";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";
import { LoginDialog } from "@/components/ui/login-dialog";

// Animation variants for smooth transitions
const fadeIn = {
  hidden: {
    opacity: 0,
    y: 20
  },
  visible: (custom: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: custom * 0.1,
      duration: 0.5,
      ease: "easeOut"
    }
  })
};

const SimpleHome = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [initialDialogTab, setInitialDialogTab] = useState<"login" | "register">("login");
  const [chatMessage, setChatMessage] = useState("");
  
  // Check for existing session
  React.useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);
  
  const handleOpenLoginDialog = () => {
    setInitialDialogTab("login");
    setShowLoginDialog(true);
    console.log("Opening login dialog");
  };
  
  const handleOpenRegisterDialog = () => {
    setInitialDialogTab("register");
    setShowLoginDialog(true);
    console.log("Opening register dialog with register tab");
  };

  const handleSendChatMessage = () => {
    if (chatMessage.trim()) {
      toast.success("Message sent! This is a demo - in a real app, this would be processed by an LLM.");
      setChatMessage("");
      handleOpenRegisterDialog(); // Optional: Open register dialog after sending message
    }
  };

  return (
    <div className="bg-minimal-white min-h-screen w-full text-minimal-black font-sans">
      {/* Login Dialog */}
      <LoginDialog 
        open={showLoginDialog} 
        onOpenChange={setShowLoginDialog}
        initialTab={initialDialogTab}
      />
      
      {/* Navigation - Simplificado */}
      <nav className="px-4 md:px-8 py-5 flex items-center justify-between max-w-7xl mx-auto">
        <Logo size="md" />
        <div className="flex items-center gap-4">
          <Button 
            size="sm" 
            variant="outline" 
            className="border-minimal-gray-300 hover:bg-minimal-gray-100"
            onClick={handleOpenLoginDialog}
          >
            <LogIn className="h-3.5 w-3.5 mr-1.5" />
            <span>Login</span> 
          </Button>
          <Button 
            size="sm" 
            className="bg-minimal-black text-minimal-white hover:bg-minimal-gray-800"
            onClick={handleOpenRegisterDialog}
          >
            <UserPlus className="h-3.5 w-3.5 mr-1.5" />
            <span>Sign Up</span>
          </Button>
        </div>
      </nav>

      {/* Hero section */}
      <motion.section className="px-4 md:px-8 py-16 md:py-28 max-w-7xl mx-auto" initial="hidden" animate="visible" variants={fadeIn} custom={0}>
        <div className="max-w-4xl mx-auto text-center">
          <motion.h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight" variants={fadeIn} custom={1}>
            AI that actually personalize your approach.
          </motion.h1>
          <motion.p className="text-lg md:text-xl text-minimal-gray-600 mb-12 max-w-2xl mx-auto" variants={fadeIn} custom={2}>
            Hyper-personalized cold outreach at scale. Get more replies, book more meetings.
          </motion.p>
          <motion.div variants={fadeIn} custom={3} className="max-w-xl mx-auto">
            {/* Chat Input replacing the Button */}
            <div className="relative bg-minimal-black rounded-full shadow-lg p-1">
              <Input
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                placeholder="Ask Mizi to create a campaign..."
                className="w-full bg-minimal-black text-minimal-white border-0 pr-12 py-6 h-auto text-base focus:ring-0 focus:outline-none placeholder:text-minimal-gray-400 rounded-full"
                onKeyDown={(e) => e.key === "Enter" && handleSendChatMessage()}
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2">
                <Button
                  onClick={handleSendChatMessage}
                  disabled={!chatMessage.trim()}
                  variant="ghost"
                  size="icon"
                  className="h-9 w-9 rounded-full bg-transparent hover:bg-minimal-gray-800 text-minimal-white"
                >
                  <Send size={16} />
                </Button>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
};

export default SimpleHome;
