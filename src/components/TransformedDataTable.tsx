
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Loader2, DownloadCloud } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransformedDataTableProps {
  surveyId: string | null;
  websiteUrl?: string;
}

interface TransformedData {
  ["primeiro nome"]?: string;
  empresa?: string;
  cargo?: string;
  email?: string;
  ["linkedin pessoal"]?: string;
  website?: string;
  setor?: string;
  ["nº de funcionários"]?: string;
  copy?: string;
}

const TransformedDataTable = ({ surveyId, websiteUrl }: TransformedDataTableProps) => {
  const [transformedData, setTransformedData] = useState<TransformedData[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!surveyId) return;

    const fetchTransformedData = async () => {
      try {
        setIsLoading(true);
        
        // Fetch data from "Data set final" table
        let query = supabase
          .from('Data set final')
          .select('*');
          
        // If we have a websiteUrl, we can use it to filter the results
        if (websiteUrl) {
          query = query.eq('website', websiteUrl);
        }
        
        // Filter by survey_id if it's added to the Data set final table
        // query = query.eq('survey_id', surveyId);
        
        const { data, error: fetchError } = await query;
        
        if (fetchError) throw fetchError;
        
        setTransformedData(data || []);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching transformed data:", error);
        setError("Falha ao carregar dados transformados");
        setIsLoading(false);
      }
    };

    fetchTransformedData();
    
    // Set up real-time listener for updates
    const channel = supabase
      .channel('transformed-data-changes')
      .on('postgres_changes', 
        {
          event: '*',
          schema: 'public',
          table: 'Data set final'
        },
        () => {
          // Reload data when changes occur
          fetchTransformedData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [surveyId, websiteUrl]);

  const downloadCSV = () => {
    if (transformedData.length === 0) return;
    
    // Create CSV content
    const headers = Object.keys(transformedData[0]).join(',');
    const rows = transformedData.map(item => 
      Object.values(item).map(val => 
        `"${val ? val.toString().replace(/"/g, '""') : ''}"`
      ).join(',')
    );
    
    const csvContent = [headers, ...rows].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    
    // Create download link and trigger click
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `transformed-data-${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500 mb-4" />
        <p className="text-gray-600">Carregando dados transformados...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 py-4">{error}</div>;
  }

  if (transformedData.length === 0) {
    return (
      <div className="text-center py-10 bg-gray-50 rounded-lg">
        <p className="text-gray-600">Nenhum dado transformado encontrado ainda.</p>
        <p className="text-gray-500 text-sm mt-2">Os dados aparecerão aqui após o processamento pelo Make.com</p>
      </div>
    );
  }

  // Determine which columns to display
  const columnsToShow = ["primeiro nome", "empresa", "cargo", "copy"];
  
  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Dados Transformados</h3>
        <Button 
          onClick={downloadCSV}
          className="flex items-center gap-1 bg-blue-500 hover:bg-blue-600"
          size="sm"
        >
          <DownloadCloud className="w-4 h-4" />
          Exportar CSV
        </Button>
      </div>
      
      <div className="border rounded-lg overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              {columnsToShow.map((column) => (
                <TableHead key={column} className="capitalize bg-gray-50">
                  {column === "primeiro nome" ? "Nome" : 
                   column === "nº de funcionários" ? "Funcionários" : column}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {transformedData.slice(0, 10).map((row, index) => (
              <TableRow key={index}>
                {columnsToShow.map((column) => (
                  <TableCell key={column} className="truncate max-w-[300px]">
                    {column === "copy" ? (
                      <p className="line-clamp-2 hover:line-clamp-none text-sm text-gray-700">
                        {row[column as keyof TransformedData]}
                      </p>
                    ) : (
                      row[column as keyof TransformedData]
                    )}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      
      {transformedData.length > 10 && (
        <p className="text-gray-500 text-sm text-right">
          Mostrando 10 de {transformedData.length} registros
        </p>
      )}
    </div>
  );
};

export default TransformedDataTable;
