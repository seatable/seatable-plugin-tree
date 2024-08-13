import { ICollaboratorProps } from '@/utils/template-utils/interfaces/Formatter/Collaborator.interface';
import React from 'react';

const FormulaFormatter: React.FC<Omit<ICollaboratorProps, 'collaborators'>> = ({
  value,
  containerClassName,
}) => {
  if (typeof value === 'string' || typeof value === 'number') {
    return (
      <div className={`${containerClassName}`}>
        <p>{value}</p>
      </div>
    );
  } else {
    return (
      <div className={`${containerClassName}`}>
        {value.map((v: string) => (
          <p key={v}>{v}</p>
        ))}
      </div>
    );
  }
};

export default FormulaFormatter;
