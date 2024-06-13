import React from 'react';
import classnames from 'classnames';
import SelectItem from './SelectItem';
import { SingleSelectFormatterProps } from '@/utils/template-utils/interfaces/Formatter/SingleSelect.interface';





const SingleSelectFormatter: React.FC<SingleSelectFormatterProps> = ({ value, options }) => {
  const getOption = () => {
    const option = options.find((item) => item.id === value || item.name === value);
    if (option) {
      return <SelectItem option={option} />;
    }
    return null;
  };

  const className = classnames('dtable-ui cell-formatter-container single-select-formatter');

  return (
    <div className={className} id={'test'}>
      {value ? getOption() : ''}
    </div>
  );
};

SingleSelectFormatter.defaultProps = {
  options: [],
};

export default SingleSelectFormatter;
