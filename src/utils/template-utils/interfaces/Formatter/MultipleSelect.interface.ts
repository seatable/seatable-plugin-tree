export interface IMultipleSelectOptions {
  id: string;
  name: string;
  color: string;
  textColor: string;
}

export interface IMultipleSelectProps {
  options: IMultipleSelectOptions[];
  value: string | string[];
}
