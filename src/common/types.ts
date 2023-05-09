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

export type Payload = {
  commonId: string;
};

export type CreateChatPayload = Payload & { startMessage: string };

export type CreateUserPayload = Payload & { userName?: string };
