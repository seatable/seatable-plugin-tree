import {
  IMultipleSelectOptions,
  IMultipleSelectProps,
} from '@/utils/template-utils/interfaces/Formatter/MultipleSelect.interface';
import React from 'react';

const MultipleSelectFormatter: React.FC<IMultipleSelectProps> = ({ value, options, isSingle }) => {
  let _options;
  if (isSingle) {
    _options = [options.find((option: IMultipleSelectOptions) => value === option.id)];
  } else {
    _options = options.filter((option: IMultipleSelectOptions) => value.includes(option.id));
  }

  return (
    <div>
      {_options.map((op: IMultipleSelectOptions | undefined) => (
        <p style={{ background: op?.color, color: op?.textColor }} key={op?.id}>
          {op?.name}
        </p>
      ))}
    </div>
  );
};

export default MultipleSelectFormatter;
