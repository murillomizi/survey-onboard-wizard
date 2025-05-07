
import React from "react";
import {
  Dialog,
  DialogContent,
  DialogOverlay
} from "@/components/ui/dialog";
import { LoginForm } from "@/components/ui/login-form";

interface LoginDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function LoginDialog({ open, onOpenChange }: LoginDialogProps) {
  const handleClose = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogOverlay className="bg-black/60" />
      <DialogContent className="p-0 border-none bg-transparent shadow-none max-w-md">
        <LoginForm onClose={handleClose} />
      </DialogContent>
    </Dialog>
  );
}
