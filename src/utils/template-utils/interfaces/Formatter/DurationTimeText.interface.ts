export interface ITimeProps {
  value: string;
  containerClassName: string;
}

export interface ITextProps extends ITimeProps {
  url: boolean;
}

export interface IDurationProps extends ITimeProps {
  format: string;
}
