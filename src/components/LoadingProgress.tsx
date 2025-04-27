
import React from "react";
import { Loader } from "lucide-react";

interface LoadingProgressProps {
  current: number;
  total: number;
}

const LoadingProgress: React.FC<LoadingProgressProps> = ({ current, total }) => {
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center gap-4">
        <Loader className="w-8 h-8 animate-spin text-survey-purple" />
        <p className="text-gray-700 font-medium">
          Processando {current}/{total} contatos
        </p>
      </div>
    </div>
  );
};

export default LoadingProgress;
