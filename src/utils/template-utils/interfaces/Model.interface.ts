import { ILevelSelections, RowExpandedInfo } from '@/utils/custom-utils/interfaces/CustomPlugin';

export interface IPresetModel {
  _id: string;
  name: string;
  settings?: any;
  customSettings?: ILevelSelections;
  expandedRows?: RowExpandedInfo[];
}
