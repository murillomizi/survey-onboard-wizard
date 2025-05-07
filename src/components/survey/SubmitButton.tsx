
import React from "react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface SubmitButtonProps {
  onSubmit: () => void;
  isSubmitting: boolean;
  hasSubmitted: boolean;
}

const SubmitButton = ({ onSubmit, isSubmitting, hasSubmitted }: SubmitButtonProps) => {
  return (
    <motion.div
      whileHover={{ scale: hasSubmitted ? 1 : 1.02 }}
      whileTap={{ scale: hasSubmitted ? 1 : 0.98 }}
    >
      <Button
        onClick={onSubmit}
        disabled={isSubmitting || hasSubmitted}
        className={`w-full text-minimal-white rounded-full shadow-sm hover:shadow-md transition-all duration-200 ${
          hasSubmitted 
            ? "bg-minimal-gray-400" 
            : "bg-minimal-black hover:bg-minimal-gray-800"
        }`}
      >
        {isSubmitting ? 'Salvando...' : hasSubmitted ? 'Enviado' : 'Continuar'}
      </Button>
    </motion.div>
  );
};

export default SubmitButton;
