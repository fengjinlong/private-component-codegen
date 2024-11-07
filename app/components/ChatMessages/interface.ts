import { Message } from 'ai';

interface ChatMessagesProps {
  messages: Array<Message>;
  input: string;
  handleInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  addToolResult: ({ toolCallId, result }: { toolCallId: string; result: string }) => void;
  onCancel: () => void;
  isLoading: boolean;
  messageImgUrl: string;
  setMessagesImgUrl: (url: string) => void;
}

export type { ChatMessagesProps };
