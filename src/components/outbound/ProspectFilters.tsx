
import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/use-toast";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Opções para filtros
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
  return (
    <div className="p-4 bg-white border-b border-minimal-gray-200 flex flex-col gap-3">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium text-minimal-gray-700">
            Prospects: {filteredProspectsCount} de {totalProspectsCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 bg-minimal-white">
                <Filter size={16} />
                Filtrar Prospects
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-minimal-white" align="end">
              <DropdownMenuLabel>Filtrar por ICP</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Indústria</p>
                <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Selecione a indústria" />
                  </SelectTrigger>
                  <SelectContent className="bg-minimal-white">
                    <SelectItem value="all" className="text-xs">Todos</SelectItem>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry} className="text-xs">{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Tamanho da Empresa</p>
                <Select value={filters.companySize} onValueChange={(value) => setFilters({...filters, companySize: value})}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Selecione o tamanho" />
                  </SelectTrigger>
                  <SelectContent className="bg-minimal-white">
                    <SelectItem value="all" className="text-xs">Todos</SelectItem>
                    {companySizeOptions.map((size) => (
                      <SelectItem key={size} value={size} className="text-xs">{size} funcionários</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Senioridade</p>
                <Select value={filters.seniority} onValueChange={(value) => setFilters({...filters, seniority: value})}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Selecione a senioridade" />
                  </SelectTrigger>
                  <SelectContent className="bg-minimal-white">
                    <SelectItem value="all" className="text-xs">Todos</SelectItem>
                    {seniorityOptions.map((seniority) => (
                      <SelectItem key={seniority} value={seniority} className="text-xs">{seniority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Localização</p>
                <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                  <SelectTrigger className="w-full h-8 text-xs">
                    <SelectValue placeholder="Selecione a localização" />
                  </SelectTrigger>
                  <SelectContent className="bg-minimal-white">
                    <SelectItem value="all" className="text-xs">Todos</SelectItem>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location} className="text-xs">{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" onClick={resetFilters} className="w-full text-xs h-8">
                  Limpar filtros
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {Object.values(filters).some(value => value !== "") && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 px-2">
              <X size={16} className="text-minimal-gray-500" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Filter badges */}
      {Object.values(filters).some(value => value !== "") && (
        <div className="flex flex-wrap gap-2">
          {filters.industry && filters.industry !== "all" && (
            <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
              Indústria: {filters.industry}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, industry: ""})} />
            </Badge>
          )}
          {filters.companySize && filters.companySize !== "all" && (
            <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
              Tamanho: {filters.companySize}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, companySize: ""})} />
            </Badge>
          )}
          {filters.seniority && filters.seniority !== "all" && (
            <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
              Senioridade: {filters.seniority}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, seniority: ""})} />
            </Badge>
          )}
          {filters.location && filters.location !== "all" && (
            <Badge variant="outline" className="bg-minimal-white text-xs flex gap-1 items-center">
              Localização: {filters.location}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, location: ""})} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProspectFilters;
