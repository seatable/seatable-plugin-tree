import { IPluginDataStore } from '@/utils/template-utils/interfaces/App.interface';
import { SelectOption } from '@/utils/template-utils/interfaces/PluginSettings.interface';
import { TableArray } from '@/utils/template-utils/interfaces/Table.interface';

export interface IPluginTLProps {
  allTables: TableArray;
  pluginDataStore: IPluginDataStore;
  levelSelections: ILevelSelections;
}

export interface PresetCustomSettings {
  [key: string]: any;
}

export interface ILevelSelections {
  first: LevelSelection;
  second: LevelSelection;
  third?: LevelSelection;
}

export interface LevelSelection {
  selected: SelectOption;
}

interface FirstLevelRow {
  rowId: string;
  rowColInfo: { col1: string };
  secondLevelRows: SecondLevelRow[];
}
interface SecondLevelRow {
  rowId: string;
  rowColInfo: { col1: string };
  thirdLevelRows: ThirdLevelRow[];
}

interface ThirdLevelRow {
  rowId: string;
  rowColInfo: { col1: string };
}

interface FinalResultItem {
  firstLevelRows: FirstLevelRow[];
}

type FinalResult = FinalResultItem[];

const finalResult = [
  {
    firstLevelRows: [
      {
        rowId: 'AAA1',
        rowColInfo: { col1: 'colName1' },
        secondLevelRows: [
          {
            rowId: 'BBB4',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
          {
            rowId: 'BBB5',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
          {
            rowId: 'BBB6',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
        ],
      },
      {
        rowId: 'AAA2',
        rowColInfo: { col1: 'colName1' },
        secondLevelRows: [
          {
            rowId: 'BBB1',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
          {
            rowId: 'BBB34',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
          {
            rowId: 'BBB6',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
        ],
      },
      {
        rowId: 'AAA3',
        rowColInfo: { col1: 'colName1' },
        secondLevelRows: [
          {
            rowId: 'BBB4',
            rowColInfo: { col1: 'colName1' },
            thirdLevelRows: [{ rowId: 'CCC', rowColInfo: { col1: 'colName1' } }],
          },
        ],
      },
    ],
  },
];
