import { usePersonalizedReturn } from "@/hooks/usePersonalizedReturn";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface PersonalizedReturnListProps {
  surveyId: string;
}

export function PersonalizedReturnList({ surveyId }: PersonalizedReturnListProps) {
  const { data, loading, error } = usePersonalizedReturn(surveyId);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-4 w-[250px]" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-20 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-red-50 p-4 text-red-500">
        Erro ao carregar dados: {error}
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="rounded-lg bg-yellow-50 p-4 text-yellow-600">
        Nenhum dado personalizado encontrado.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {data.map((item) => (
        <Card key={item.id}>
          <CardHeader>
            <CardTitle className="text-lg">
              {item.empresa} - {item.cargo}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p className="text-sm text-gray-500">
                {item["primeiro nome"]} • {item.email}
              </p>
              <div className="rounded-lg bg-gray-50 p-4">
                <p className="whitespace-pre-wrap text-sm">{item.copy}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
} 