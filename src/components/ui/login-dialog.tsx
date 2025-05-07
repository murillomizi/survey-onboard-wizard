
import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/ui/login-form";
import { RegisterForm } from "@/components/ui/register-form";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialTab?: "login" | "register";
}

export function LoginDialog({ open, onOpenChange, initialTab = "login" }: LoginDialogProps) {
  // Garantir que o estado inicial do tab seja corretamente definido pelo prop initialTab
  const [activeTab, setActiveTab] = useState<"login" | "register">(initialTab);
  
  // Atualizar o activeTab quando o initialTab mudar
  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
      console.log("initialTab mudou para:", initialTab);
    }
  }, [initialTab]);
  
  const handleClose = () => {
    onOpenChange(false);
  };

  const switchToRegister = () => {
    setActiveTab("register");
  };

  const switchToLogin = () => {
    setActiveTab("login");
  };

  // Adicionar log para depuração
  console.log("LoginDialog rendered with activeTab:", activeTab);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60" />
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md">
        {activeTab === "login" ? (
          <LoginForm onClose={handleClose} switchToRegister={switchToRegister} />
        ) : (
          <RegisterForm onClose={handleClose} switchToLogin={switchToLogin} />
        )}
      </DialogContent>
    </Dialog>
  );
}
