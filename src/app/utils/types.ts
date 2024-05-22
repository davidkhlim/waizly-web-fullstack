export type PRIORITY_t = {
  high: string;
  medium: string;
  low: string;
};

export type TODOS_t = {
  id: number;
  created_at: string;
  updated_at: string;
  title: string;
  description: string | null;
  due_date_at: string | null;
  due_date: string | null;
  due_date_desc: { type: number; val: string };
  priority: "low" | "medium" | "high";
  is_done: boolean;
};
