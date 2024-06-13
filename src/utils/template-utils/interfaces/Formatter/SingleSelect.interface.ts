export interface Option {
  id: string;
  name: string;
  color: string;
  textColor?: string;
}

export interface SelectItemProps {
  option: Option;
  fontSize?: number;
}

export interface SingleSelectFormatterProps {
  value?: string;
  containerClassName?: string;
  fontSize?: number;
  options: Option[];
}
