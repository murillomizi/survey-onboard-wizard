
import React, { useEffect } from 'react';
import ChatMessage from './ChatMessage';

interface ProcessingProgressProps {
  processedCount: number;
  totalRows: number;
  isComplete: boolean;
}

const ProcessingProgress: React.FC<ProcessingProgressProps> = ({
  processedCount,
  totalRows,
  isComplete
}) => {
  const getMessage = () => {
    if (isComplete) {
      return `Perfect! All ${totalRows} entries have been processed. (${processedCount}/${totalRows})`;
    }
    if (processedCount === 0) {
      return `Processing your data... (${processedCount}/${totalRows})`;
    }
    return `Still working... (${processedCount}/${totalRows})`;
  };

  return (
    <ChatMessage
      content={getMessage()}
      type="bot"
    />
  );
};

export default ProcessingProgress;
