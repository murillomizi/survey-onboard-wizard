
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

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
}

const LoadingMessages = ({ processedCount, totalCount }: LoadingMessagesProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % messages.length);
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/90 to-purple-600/90 flex items-center justify-center z-50">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white rounded-xl p-8 shadow-2xl">
          <div className="flex flex-col items-center text-center space-y-6">
            <div className="flex flex-col items-center gap-2">
              <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
              <span className="text-sm font-medium text-gray-500">
                {processedCount}/{totalCount} processados
              </span>
            </div>
            <AnimatePresence mode="wait">
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
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoadingMessages;
