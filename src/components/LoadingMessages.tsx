
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { Progress } from "@/components/ui/progress";
import { WebhookStatus } from '@/types/survey';

const messages = [
  "Analisando o perfil dos seus prospects...",
  "Identificando pontos de conexão personalizados...",
  "Criando abordagens que geram respostas...",
  "Otimizando o tom de voz para sua audiência...",
  "Preparando mensagens que convertem...",
  "Calculando as melhores estratégias de engajamento...",
  "Potencializando suas chances de resposta...",
  "Desenvolvendo conexões significativas...",
  "Transformando dados em conversas relevantes...",
  "Criando mensagens que se destacam...",
  "Personalizando cada detalhe da sua abordagem...",
  "Maximizando seu potencial de conversão...",
  "Eliminando mensagens genéricas do seu radar...",
  "Construindo pontes para novas oportunidades...",
  "Preparando o terreno para mais agendamentos...",
  "Transformando prospects em conversas reais...",
  "Criando momentos de conexão autêntica...",
  "Desenvolvendo abordagens que fazem sentido...",
  "Ajustando o tom perfeito para cada mensagem...",
  "Elevando o nível das suas prospecções...",
  "Garantindo que cada palavra conte...",
  "Transformando dados em oportunidades...",
  "Personalizando cada interação...",
  "Preparando mensagens que fazem a diferença...",
  "Você está prestes a revolucionar suas abordagens..."
];

interface LoadingMessagesProps {
  processedCount: number;
  totalCount: number;
  webhookStatus?: WebhookStatus;
  onDownload?: () => void;
  isProcessingComplete?: boolean;
}

const LoadingMessages = ({ 
  processedCount, 
  totalCount, 
  webhookStatus = "processing",
  onDownload,
  isProcessingComplete = false
}: LoadingMessagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  const progressPercentage = totalCount > 0 ? (processedCount / totalCount) * 100 : 0;

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/90 to-purple-600/90 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex flex-col items-center gap-4">
              {webhookStatus === "error" ? (
                <AlertCircle className="w-12 h-12 text-red-500" />
              ) : isProcessingComplete ? (
                <CheckCircle2 className="w-12 h-12 text-emerald-500" />
              ) : (
                <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              )}
              
              <div className="flex flex-col gap-3 w-full">
                <div className="flex justify-between w-full">
                  <span className="text-sm font-medium text-gray-500">
                    {processedCount}/{totalCount} processados
                  </span>
                  <span className="text-sm font-medium text-gray-500">
                    {Math.round(progressPercentage)}%
                  </span>
                </div>
                <Progress value={progressPercentage} className="h-2 w-full bg-gray-100" />
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {isProcessingComplete ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="flex flex-col gap-4"
                >
                  <p className="text-lg text-gray-700 font-medium">
                    Processamento concluído com sucesso!
                  </p>
                  {onDownload && (
                    <button
                      onClick={onDownload}
                      className="mt-2 bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-6 py-2 rounded-full hover:opacity-90 transition-all duration-200 shadow-md"
                    >
                      Baixar resultados
                    </button>
                  )}
                </motion.div>
              ) : webhookStatus === "error" ? (
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-red-600 font-medium"
                >
                  Ocorreu um erro durante o processamento. Por favor, tente novamente.
                </motion.p>
              ) : (
                <motion.p
                  key={currentIndex}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                  className="text-lg text-gray-700 font-medium"
                >
                  {messages[currentIndex]}
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessages;
