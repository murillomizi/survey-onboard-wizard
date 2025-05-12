
import React from "react";
import { UserRound } from "lucide-react";
import { User } from "@supabase/supabase-js";

interface UserProfileProps {
  user: User | null;
  isOutboundPage?: boolean;
}

const UserProfile: React.FC<UserProfileProps> = ({ 
  user, 
  isOutboundPage = false 
}) => {
  if (!user) return null;
  
  return (
    <div className="p-3">
      <div className="flex items-center gap-2">
        <div className="bg-primary/10 rounded-full p-2">
          <UserRound size={20} className={isOutboundPage ? "text-minimal-white" : "text-minimal-black"} />
        </div>
        <div className="flex flex-col">
          <span className={`text-sm font-medium ${isOutboundPage ? "text-minimal-white" : "text-minimal-gray-900"}`}>
            {user.email}
          </span>
          <span className={`text-xs ${isOutboundPage ? "text-minimal-gray-400" : "text-minimal-gray-500"}`}>
            Último acesso: {new Date(user.last_sign_in_at || "").toLocaleString()}
          </span>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
