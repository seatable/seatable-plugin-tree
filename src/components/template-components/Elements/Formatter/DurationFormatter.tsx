import React from 'react';
import { getDurationDisplayString } from 'dtable-utils';
import { IDurationProps } from '@/utils/template-utils/interfaces/Formatter/DurationTimeText.interface';

const DurationFormatter: React.FC<IDurationProps> = ({ value, format, containerClassName }) => {

  return (
    <div className={`${containerClassName}`}>
      {getDurationDisplayString(value, { duration_format: format })}
    </div>
  );
};

export default DurationFormatter;
