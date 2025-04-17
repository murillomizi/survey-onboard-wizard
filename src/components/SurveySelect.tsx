
import React from "react";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue 
} from "@/components/ui/select";
import { 
  CircleEllipsis, 
  Volume2, 
  FileText, 
  Zap 
} from "lucide-react";

interface SurveySelectProps {
  title: string;
  description: string;
  options: { value: string; label: string }[];
  icon: "touchpoints" | "voice" | "template" | "triggers";
  onChange: (value: string) => void;
  defaultValue?: string;
}

const SurveySelect = ({
  title,
  description,
  options,
  icon,
  onChange,
  defaultValue
}: SurveySelectProps) => {
  const getIcon = () => {
    switch (icon) {
      case "touchpoints":
        return <CircleEllipsis className="h-5 w-5 mr-2 text-survey-muted" />;
      case "voice":
        return <Volume2 className="h-5 w-5 mr-2 text-survey-muted" />;
      case "template":
        return <FileText className="h-5 w-5 mr-2 text-survey-muted" />;
      case "triggers":
        return <Zap className="h-5 w-5 mr-2 text-survey-muted" />;
      default:
        return null;
    }
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex items-center gap-1 mb-2">
        {getIcon()}
        <span className="text-survey-text font-medium">{title}</span>
      </div>
      <Select onValueChange={onChange} defaultValue={defaultValue}>
        <SelectTrigger className="w-full bg-survey-card text-survey-text border-gray-700 focus:ring-survey-purple">
          <SelectValue placeholder="Selecione uma opção" />
        </SelectTrigger>
        <SelectContent className="bg-survey-card text-survey-text border-gray-700">
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <p className="text-survey-muted text-sm mt-1 italic">{description}</p>
    </div>
  );
};

export default SurveySelect;
