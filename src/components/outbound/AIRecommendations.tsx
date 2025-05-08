
import React, { useState } from "react";
import { Lightbulb, LightbulbOff } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface AIRecommendationsProps {
  contentType: "email" | "linkedin";
}

const AIRecommendations: React.FC<AIRecommendationsProps> = ({ contentType }) => {
  const [showRecommendations, setShowRecommendations] = useState(true);

  // AI Recommendations based on content type
  const getRecommendations = () => {
    if (contentType === "email") {
      return [
        "Adicione o nome da empresa do destinatário no assunto para personalização",
        "Inclua números específicos ou estatísticas para aumentar a credibilidade",
        "Reduza o comprimento do primeiro parágrafo para capturar atenção mais rapidamente",
        "Substitua termos genéricos como 'solução' por nomes específicos do seu produto"
      ];
    } else {
      return [
        "Adicione uma pergunta logo no início para aumentar o engajamento",
        "Mencione uma conexão em comum se possível",
        "Evite parágrafos longos, mantenha cada um com 2-3 linhas no máximo",
        "Termine com uma pergunta específica em vez de um pedido genérico"
      ];
    }
  };

  return (
    <div className="mx-6 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-minimal-gray-700 font-medium">
          <Lightbulb size={18} className="text-amber-500" />
          <span>Recomendações de IA</span>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => setShowRecommendations(!showRecommendations)}
          className="text-xs flex items-center gap-1"
        >
          {showRecommendations ? (
            <>
              <LightbulbOff size={14} />
              Ocultar
            </>
          ) : (
            <>
              <Lightbulb size={14} />
              Mostrar
            </>
          )}
        </Button>
      </div>
      
      {showRecommendations && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-2"
        >
          <Alert className="bg-amber-50 border-amber-200">
            <AlertTitle className="text-amber-800 flex items-center gap-2 text-sm">
              Sugestões para melhorar sua copy de {contentType === "email" ? "email" : "LinkedIn"}
            </AlertTitle>
            <AlertDescription>
              <ul className="list-disc pl-5 mt-2 space-y-1 text-amber-700 text-xs">
                {getRecommendations().map((recommendation, index) => (
                  <li key={index}>{recommendation}</li>
                ))}
              </ul>
            </AlertDescription>
          </Alert>
        </motion.div>
      )}
    </div>
  );
};

export default AIRecommendations;
