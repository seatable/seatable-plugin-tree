import { ITextProps } from '@/utils/template-utils/interfaces/Formatter/DurationTimeText.interface';
import React from 'react';

const TextFormatter: React.FC<ITextProps> = ({ value, containerClassName, url }) => {
  return (
    <div className={`${containerClassName}`}>
      {url ? (
        <a href={value} target="_blank" rel="noreferrer">
          {value}
        </a>
      ) : (
        <p>{value}</p>
      )}
    </div>
  );
};

export default TextFormatter;
