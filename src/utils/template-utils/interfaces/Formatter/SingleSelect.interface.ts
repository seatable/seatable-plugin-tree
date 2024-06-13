export interface SelectItemOption {
  id: string;
  name: string;
  color: string;
  textColor?: string;
}

export interface SelectItemProps {
  option: SelectItemOption;
  fontSize?: number;
}

export interface ISingleSelectProps {
  value?: string;
  containerClassName?: string;
  fontSize?: number;
  options: SelectItemOption[];
}
