
import React from "react";
import { Info } from "lucide-react";

const OutboundTips: React.FC = () => {
  return (
    <div className="mt-6 p-4 bg-minimal-gray-100 border border-minimal-gray-300 rounded-lg text-sm text-minimal-gray-600">
      <div className="flex items-center gap-2 mb-2 text-minimal-gray-700 font-medium">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        Dicas para mensagens de outbound
      </div>
      <ul className="list-disc pl-5 space-y-1 text-minimal-gray-600">
        <li>Personalize sempre com o nome do destinatário</li>
        <li>Mantenha o assunto direto e com valor agregado</li>
        <li>Foque em benefícios, não em características</li>
        <li>Termine com um pedido de ação claro (CTA)</li>
      </ul>
    </div>
  );
};

export default OutboundTips;
