
import React from "react";
import { Input } from "@/components/ui/input";
import { ContentType } from "@/types/outbound";

interface ContentEditorProps {
  contentType: ContentType;
  emailSubject: string;
  emailBody: string;
  linkedinContent: string;
  onEmailSubjectChange: (value: string) => void;
  onEmailBodyChange: (value: string) => void;
  onLinkedinContentChange: (value: string) => void;
}

const ContentEditor: React.FC<ContentEditorProps> = ({
  contentType,
  emailSubject,
  emailBody,
  linkedinContent,
  onEmailSubjectChange,
  onEmailBodyChange,
  onLinkedinContentChange
}) => {
  return (
    <div className="border-minimal-gray-200 overflow-y-auto max-h-[500px] bg-white p-4 font-sans">
      {contentType === "email" ? (
        <div>
          <div className="mb-4">
            <label htmlFor="email-subject" className="text-sm font-medium text-minimal-black block mb-1">
              Email Subject
            </label>
            <Input
              id="email-subject"
              value={emailSubject}
              onChange={(e) => onEmailSubjectChange(e.target.value)}
              className="border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 text-minimal-black"
              placeholder="Enter email subject..."
            />
          </div>
          
          <div>
            <label htmlFor="email-body" className="text-sm font-medium text-minimal-black block mb-1">
              Email Body
            </label>
            <textarea
              id="email-body"
              value={emailBody}
              onChange={(e) => onEmailBodyChange(e.target.value)}
              className="w-full h-[350px] border rounded-md p-3 text-minimal-black border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 focus:outline-none resize-none font-mono"
              placeholder="Enter email body..."
            />
          </div>
        </div>
      ) : (
        <div>
          <label htmlFor="linkedin-content" className="text-sm font-medium text-minimal-black block mb-1">
            LinkedIn Message
          </label>
          <textarea
            id="linkedin-content"
            value={linkedinContent}
            onChange={(e) => onLinkedinContentChange(e.target.value)}
            className="w-full h-[350px] border rounded-md p-3 text-minimal-black border-minimal-gray-200 focus:ring-minimal-gray-300 focus:border-minimal-gray-400 focus:outline-none resize-none font-mono"
            placeholder="Enter LinkedIn message..."
          />
        </div>
      )}
    </div>
  );
};

export default ContentEditor;
