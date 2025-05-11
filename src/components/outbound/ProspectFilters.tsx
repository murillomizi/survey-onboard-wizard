
import React from "react";
import { Filter, X } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  return (
    <div className="p-4 bg-white border-b border-minimal-gray-200 flex flex-col gap-3 font-sans">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          <span className="text-sm font-medium text-minimal-black">
            Prospects: {filteredProspectsCount} of {totalProspectsCount}
          </span>
        </div>
        
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-2 h-9 bg-white border-minimal-gray-300 text-minimal-black hover:bg-minimal-gray-100">
                <Filter size={16} />
                Filter Prospects
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56 bg-white" align="end">
              <DropdownMenuLabel className="text-minimal-black">Filter by ICP</DropdownMenuLabel>
              <DropdownMenuSeparator />
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Industry</p>
                <Select value={filters.industry} onValueChange={(value) => setFilters({...filters, industry: value})}>
                  <SelectTrigger className="w-full h-8 text-xs border-minimal-gray-300 text-minimal-black">
                    <SelectValue placeholder="Select industry" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    {industryOptions.map((industry) => (
                      <SelectItem key={industry} value={industry} className="text-xs">{industry}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Company Size</p>
                <Select value={filters.companySize} onValueChange={(value) => setFilters({...filters, companySize: value})}>
                  <SelectTrigger className="w-full h-8 text-xs border-minimal-gray-300 text-minimal-black">
                    <SelectValue placeholder="Select size" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    {companySizeOptions.map((size) => (
                      <SelectItem key={size} value={size} className="text-xs">{size} employees</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Seniority</p>
                <Select value={filters.seniority} onValueChange={(value) => setFilters({...filters, seniority: value})}>
                  <SelectTrigger className="w-full h-8 text-xs border-minimal-gray-300 text-minimal-black">
                    <SelectValue placeholder="Select seniority" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    {seniorityOptions.map((seniority) => (
                      <SelectItem key={seniority} value={seniority} className="text-xs">{seniority}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="p-2">
                <p className="text-xs text-minimal-gray-500 mb-1">Location</p>
                <Select value={filters.location} onValueChange={(value) => setFilters({...filters, location: value})}>
                  <SelectTrigger className="w-full h-8 text-xs border-minimal-gray-300 text-minimal-black">
                    <SelectValue placeholder="Select location" />
                  </SelectTrigger>
                  <SelectContent className="bg-white">
                    <SelectItem value="all" className="text-xs">All</SelectItem>
                    {locationOptions.map((location) => (
                      <SelectItem key={location} value={location} className="text-xs">{location}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <DropdownMenuSeparator />
              <div className="p-2">
                <Button variant="outline" size="sm" onClick={resetFilters} className="w-full text-xs h-8 border-minimal-gray-300 text-minimal-black hover:bg-minimal-gray-100">
                  Clear filters
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          
          {Object.values(filters).some(value => value !== "") && (
            <Button variant="ghost" size="sm" onClick={resetFilters} className="h-9 px-2 text-minimal-black hover:bg-minimal-gray-100">
              <X size={16} className="text-minimal-gray-500" />
            </Button>
          )}
        </div>
      </div>
      
      {/* Filter badges */}
      {Object.values(filters).some(value => value !== "") && (
        <div className="flex flex-wrap gap-2">
          {filters.industry && filters.industry !== "all" && (
            <Badge variant="outline" className="bg-white text-xs flex gap-1 items-center text-minimal-black border-minimal-gray-300">
              Industry: {filters.industry}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, industry: ""})} />
            </Badge>
          )}
          {filters.companySize && filters.companySize !== "all" && (
            <Badge variant="outline" className="bg-white text-xs flex gap-1 items-center text-minimal-black border-minimal-gray-300">
              Size: {filters.companySize}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, companySize: ""})} />
            </Badge>
          )}
          {filters.seniority && filters.seniority !== "all" && (
            <Badge variant="outline" className="bg-white text-xs flex gap-1 items-center text-minimal-black border-minimal-gray-300">
              Seniority: {filters.seniority}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, seniority: ""})} />
            </Badge>
          )}
          {filters.location && filters.location !== "all" && (
            <Badge variant="outline" className="bg-white text-xs flex gap-1 items-center text-minimal-black border-minimal-gray-300">
              Location: {filters.location}
              <X size={12} className="cursor-pointer" onClick={() => setFilters({...filters, location: ""})} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProspectFilters;
