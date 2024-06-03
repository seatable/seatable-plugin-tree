import { ILevelSelections } from '../interfaces/CustomPlugin';

const LINK_TYPE = {
  link: 'link',
  formula: 'link-formula',
  formula2nd: 'link-formula-2nd',
};

const defaultSelectOption = {
  value: '',
  label: '',
};
const LEVEL_SEL_DEFAULT: ILevelSelections = {
  first: { selected: defaultSelectOption },
  second: { selected: defaultSelectOption },
  third: { selected: defaultSelectOption },
};

const INDEX_COLUMN_TYPE = 'index';

const INDEX_COLUMN = {
  type: INDEX_COLUMN_TYPE,
  name: 'index',
  width: 80,
  key: 'index',
};

const THIRD_LEVEL_DATA_DEFAULT = {
  value: '',
  label: '',
};

export { LINK_TYPE, LEVEL_SEL_DEFAULT, INDEX_COLUMN_TYPE, INDEX_COLUMN, THIRD_LEVEL_DATA_DEFAULT };
