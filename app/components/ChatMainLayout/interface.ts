export interface ChatMainLayoutProps {
  mainContent: React.ReactNode;
  selectedModel: string;
  onModelChange: (model: string) => void;
}
