
import React from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Globe } from "lucide-react";

interface WebsiteInputProps {
  value: string;
  onChange: (value: string) => void;
}

const WebsiteInput: React.FC<WebsiteInputProps> = ({ value, onChange }) => {
  return (
    <div className="space-y-2">
      <Label htmlFor="websiteUrl" className="text-survey-text font-medium flex items-center gap-2">
        <Globe size={18} className="text-survey-muted" />
        Site da empresa
      </Label>
      <Input
        id="websiteUrl"
        type="url"
        placeholder="https://exemplo.com.br"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-survey-card text-survey-text border-gray-700"
      />
      <p className="text-survey-muted text-sm italic">
        Insira o site da empresa para personalização das mensagens
      </p>
    </div>
  );
};

export default WebsiteInput;
