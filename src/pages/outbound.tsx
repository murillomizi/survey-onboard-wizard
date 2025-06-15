import { useParams } from "react-router-dom";
import { usePersonalizedReturn } from "@/hooks/usePersonalizedReturn";

export default function OutboundPage() {
  const { surveyId } = useParams();
  const { data, loading, error } = usePersonalizedReturn(surveyId);

  if (loading) return <div>Carregando...</div>;
  if (error) return <div>Erro: {error}</div>;
  if (!data.length) return <div>Nenhum resultado encontrado para esse survey.</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="mb-6 text-2xl font-bold">Resultados Personalizados</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.map(item => (
          <div key={item.id} className="border rounded-lg p-4 bg-white shadow">
            <h2 className="font-bold text-lg mb-2">{item["primeiro nome"]} ({item.empresa})</h2>
            <div className="mb-2">
              <span className="font-semibold">Email:</span>
              <div className="bg-gray-100 p-2 rounded whitespace-pre-wrap">{item.copy}</div>
            </div>
            <div>
              <span className="font-semibold">LinkedIn:</span>
              <div className="bg-blue-50 p-2 rounded break-all">{item["linkedin pessoal"]}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
} 