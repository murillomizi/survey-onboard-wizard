import { useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useHasPersonalizedReturn } from "@/hooks/useHasPersonalizedReturn";

export default function OnboardingSuccess() {
  const { surveyId } = useParams();
  const navigate = useNavigate();
  const { exists, loading } = useHasPersonalizedReturn(surveyId);

  useEffect(() => {
    if (!loading && exists && surveyId) {
      navigate(`/outbound/${surveyId}`);
    }
  }, [exists, loading, surveyId, navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <h2 className="text-2xl font-bold mb-4">Processando seu onboarding...</h2>
      {!loading && !exists && <p className="text-gray-600">Aguardando retorno personalizado...</p>}
      {loading && <p className="text-gray-600">Verificando status...</p>}
    </div>
  );
} 