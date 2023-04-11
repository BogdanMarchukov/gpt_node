export type Usage = {
  prompt_tokens: number;
  completion_tokens: number;
  total_tokens: number;
};

export enum RoleType {
  Assistant = 'assistant',
  User = 'user',
}

export type Message = {
  role: RoleType;
  content: string;
};
