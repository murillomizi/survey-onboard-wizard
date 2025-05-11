import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Filter options
const industryOptions = ["Tecnologia", "Software", "Varejo", "Serviços", "Logística"];
const companySizeOptions = ["1-10", "11-50", "51-200", "201-500", "501-1000", "1000+"];
const seniorityOptions = ["Analista", "Coordenador", "Gerente", "Diretor", "VP", "C-Level"];
const locationOptions = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Curitiba", "Campinas"];
interface FilterOptions {
  industry: string;
  companySize: string;
  seniority: string;
  location: string;
}
interface ProspectFiltersProps {
  filters: FilterOptions;
  setFilters: (filters: FilterOptions) => void;
  filteredProspectsCount: number;
  totalProspectsCount: number;
  resetFilters: () => void;
}
const ProspectFilters: React.FC<ProspectFiltersProps> = ({
  filters,
  setFilters,
  filteredProspectsCount,
  totalProspectsCount,
  resetFilters
}) => {
  return;
};
export default ProspectFilters;