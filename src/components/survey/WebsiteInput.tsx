
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
        Company Website
      </Label>
      <Input
        id="websiteUrl"
        type="url"
        placeholder="https://example.com"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-survey-card text-survey-text border-gray-700"
      />
      <p className="text-survey-muted text-sm italic">
        Enter your company website for personalized messages
      </p>
    </div>
  );
};

export default WebsiteInput;
