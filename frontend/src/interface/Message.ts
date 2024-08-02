export interface IMessage extends Record<string, any> {
  role: string;
  content: string;
}
