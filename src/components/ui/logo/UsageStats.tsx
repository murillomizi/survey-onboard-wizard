
import React from "react";

interface UsageStatsProps {
  isOutboundPage?: boolean;
}

const UsageStats: React.FC<UsageStatsProps> = ({ 
  isOutboundPage = false 
}) => {
  return (
    <div className={`p-3 ${isOutboundPage ? "border-minimal-gray-700 text-minimal-gray-300" : "border-minimal-gray-200 text-minimal-gray-600"}`}>
      <h4 className={`text-xs font-medium mb-2 ${isOutboundPage ? "text-minimal-gray-300" : "text-minimal-gray-600"}`}>
        Usage Limits
      </h4>
      <div className="space-y-2">
        <div className="flex justify-between items-center text-xs">
          <span>Prospects used:</span>
          <span className="font-medium">48 / 100</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '48%' }}></div>
        </div>
        <div className="flex justify-between items-center text-xs">
          <span>API Requests:</span>
          <span className="font-medium">324 / 1000</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-1.5">
          <div className="bg-green-600 h-1.5 rounded-full" style={{ width: '32.4%' }}></div>
        </div>
      </div>
    </div>
  );
};

export default UsageStats;
