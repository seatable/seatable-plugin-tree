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

export { LINK_TYPE, LEVEL_SEL_DEFAULT };
