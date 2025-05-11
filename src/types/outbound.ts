
export type Message = {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
};

export type ContentType = "email" | "linkedin";

export interface Prospect {
  id: number;
  firstName: string;
  lastName: string;
  jobTitle: string;
  company: string;
  industry: string;
  companySize: string;
  seniority: string;
  location: string;
}

export interface EmailFollowUp {
  subject: string;
  body: string;
}

export interface FollowUps {
  email: EmailFollowUp[];
  linkedin: string[];
}

export interface FilterOptions {
  industry: string;
  companySize: string;
  seniority: string;
  location: string;
}
