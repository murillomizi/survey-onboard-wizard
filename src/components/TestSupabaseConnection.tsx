import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

export function TestSupabaseConnection() {
  const [testResult, setTestResult] = useState<{
    status: "loading" | "success" | "error";
    message: string;
    data?: any;
  }>({ status: "loading", message: "Testando conexão..." });

  useEffect(() => {
    async function testConnection() {
      try {
        // Teste 1: Verificar se consegue listar as tabelas
        const { data: tables, error: tablesError } = await supabase
          .from("mizi_ai_personalized_return")
          .select("count")
          .limit(1);

        if (tablesError) {
          throw new Error(`Erro ao acessar tabela: ${tablesError.message}`);
        }

        // Teste 2: Tentar buscar um registro
        const { data, error } = await supabase
          .from("mizi_ai_personalized_return")
          .select("*")
          .limit(1);

        if (error) {
          throw new Error(`Erro ao buscar dados: ${error.message}`);
        }

        setTestResult({
          status: "success",
          message: "Conexão com Supabase funcionando!",
          data: {
            tables,
            sampleData: data,
          },
        });
      } catch (error) {
        setTestResult({
          status: "error",
          message: error instanceof Error ? error.message : "Erro desconhecido",
        });
      }
    }

    testConnection();
  }, []);

  return (
    <div className="rounded-lg border p-4">
      <h2 className="mb-4 text-lg font-bold">Teste de Conexão Supabase</h2>
      
      <div className="mb-4">
        <div className="font-semibold">Status:</div>
        <div
          className={`mt-1 rounded px-2 py-1 ${
            testResult.status === "loading"
              ? "bg-yellow-100 text-yellow-800"
              : testResult.status === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {testResult.message}
        </div>
      </div>

      {testResult.data && (
        <div className="mt-4">
          <div className="font-semibold">Dados de Teste:</div>
          <pre className="mt-1 overflow-auto rounded bg-gray-100 p-2 text-sm">
            {JSON.stringify(testResult.data, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
} 