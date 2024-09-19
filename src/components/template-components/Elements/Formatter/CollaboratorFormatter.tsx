import {
  ICollaborator,
  ICollaboratorProps,
} from '@/utils/template-utils/interfaces/Formatter/Collaborator.interface';
import React from 'react';
import style from '../../../../styles/template-styles/formatter/Collaborator.module.scss';

const CollaboratorFormatter: React.FC<ICollaboratorProps> = ({
  value,
  containerClassName,
  collaborators,
}) => {
  console.log({ value });
  console.log({ collaborators });
  let collaborator;
  if (typeof value === 'string') {
    collaborator = collaborators.find((c: ICollaborator) => c.email === value);
    console.log(typeof value);
    console.log({ collaborator });
  } else {
    collaborator = collaborators.find((c: ICollaborator) => c.email === value[0]);
    console.log(typeof value);
    console.log({ collaborator });
  }

  return (
    <div className={`${containerClassName} ${style.collaborator}`}>
      <img src={collaborator?.avatar_url} alt={collaborator?.name} />
      <p style={{ marginBottom: 0 }}>{collaborator?.name}</p>
    </div>
  );
};

export default CollaboratorFormatter;
