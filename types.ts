
export interface TranslationState {
  inputText: string;
  outputText: string;
  isTranslating: boolean;
  error: string | null;
}

export interface DocumentState {
  fileName: string | null;
  fileContent: string | null;
  translatedContent: string | null;
  isProcessing: boolean;
}

export enum AppMode {
  TEXT = 'TEXT',
  DOCUMENT = 'DOCUMENT'
}
