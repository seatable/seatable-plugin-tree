import {
  IMultipleSelectOptions,
  IMultipleSelectProps,
} from '@/utils/template-utils/interfaces/Formatter/MultipleSelect.interface';
import React from 'react';
import SelectItem from './SingleSelectFormatter/SelectItem';

const MultipleSelectFormatter: React.FC<IMultipleSelectProps> = ({ value, options }) => {
  const _options = options.filter((option: IMultipleSelectOptions) => value.includes(option.id));

  return (
    <div>
      {_options.map((op: IMultipleSelectOptions) => (
        <SelectItem key={op.id} option={op} />
      ))}
    </div>
  );
};

export default MultipleSelectFormatter;
