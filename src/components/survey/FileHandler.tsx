
import React, { useRef } from "react";

interface FileHandlerProps {
  onFileChange: (file: File) => void;
}

const FileHandler: React.FC<FileHandlerProps> = ({ onFileChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onFileChange(file);
    }
  };

  return (
    <input
      type="file"
      accept=".csv"
      ref={fileInputRef}
      onChange={handleFileChange}
      className="hidden"
    />
  );
};

export default FileHandler;
