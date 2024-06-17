export interface ILongText {
  checklist: { total: number; completed: number };
  images: string[];
  links: string[];
  preview: string;
  text: string;
}

export interface ILongTextProps {
  value: ILongText;
  containerClassName: string;
}
