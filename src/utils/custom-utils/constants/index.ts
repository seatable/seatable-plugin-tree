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
  first: { selected: defaultSelectOption, isDisabled: false },
  second: { selected: defaultSelectOption, isDisabled: false },
  third: { selected: defaultSelectOption, isDisabled: false },
};

const INDEX_COLUMN_TYPE = 'index';

const INDEX_COLUMN = {
  type: INDEX_COLUMN_TYPE,
  name: 'index',
  width: 80,
  key: 'index',
};

const LEVEL_DATA_DEFAULT = {
  value: '',
  label: '',
};
const LEVEL_DATA_DISABLED = {
  value: 'disabledLvl',
  label: 'Disable Level',
};

export {
  LINK_TYPE,
  LEVEL_SEL_DEFAULT,
  INDEX_COLUMN_TYPE,
  INDEX_COLUMN,
  LEVEL_DATA_DEFAULT,
  LEVEL_DATA_DISABLED,
};
