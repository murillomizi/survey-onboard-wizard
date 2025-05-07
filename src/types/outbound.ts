
export type Message = {
  content: string;
  role: "user" | "assistant";
  isLoading?: boolean;
};

export type ContentType = "email" | "linkedin";
