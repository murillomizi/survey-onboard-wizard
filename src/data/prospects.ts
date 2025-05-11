
// Tipo para os prospects
export interface Prospect {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  industry: string;
  companySize: string;
  seniority: string;
  location: string;
}

// Dados de prospects simulados com campos adicionais para filtro
export const mockProspects: Prospect[] = [
  { id: 1, firstName: "Maria", lastName: "Silva", jobTitle: "Diretora de Marketing", company: "TechSolutions", industry: "Tecnologia", companySize: "51-200", seniority: "Diretor", location: "São Paulo" },
  { id: 2, firstName: "João", lastName: "Santos", jobTitle: "CEO", company: "Inovação Digital", industry: "Software", companySize: "11-50", seniority: "C-Level", location: "Rio de Janeiro" },
  { id: 3, firstName: "Ana", lastName: "Oliveira", jobTitle: "Gerente de Vendas", company: "MegaVendas", industry: "Varejo", companySize: "201-500", seniority: "Gerente", location: "Curitiba" },
  { id: 4, firstName: "Carlos", lastName: "Ferreira", jobTitle: "CTO", company: "DataPro", industry: "Tecnologia", companySize: "51-200", seniority: "C-Level", location: "São Paulo" },
  { id: 5, firstName: "Juliana", lastName: "Almeida", jobTitle: "COO", company: "StartupNow", industry: "Serviços", companySize: "11-50", seniority: "C-Level", location: "Belo Horizonte" },
  { id: 6, firstName: "Roberto", lastName: "Souza", jobTitle: "Diretor Comercial", company: "VendaMais", industry: "Varejo", companySize: "201-500", seniority: "Diretor", location: "São Paulo" },
  { id: 7, firstName: "Paula", lastName: "Costa", jobTitle: "VP de Operações", company: "LogTech", industry: "Logística", companySize: "501-1000", seniority: "VP", location: "Campinas" },
];

// Opções para filtros
export const industryOptions = ["Tecnologia", "Software", "Varejo", "Serviços", "Logística"];
export const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
export const seniorityOptions = ["Analista", "Coordenador", "Gerente", "Diretor", "VP", "C-Level"];
export const locationOptions = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Campinas"];
