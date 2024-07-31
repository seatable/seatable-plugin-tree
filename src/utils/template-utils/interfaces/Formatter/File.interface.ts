export interface IFile {
  name: string;
  size: number;
  type: string;
  upload_time: string;
  url: string;
}

export interface FileFormatterProps {
  isSample?: boolean;
  value?: IFile[];
  containerClassName?: string;
  renderItem?: (item: React.ReactNode) => React.ReactNode;
}

export interface FormulaRowsObj {
  [key: string]: RowItem[] | null;
}

interface RowItem {
  row_id: string;
  display_value: string;
}


