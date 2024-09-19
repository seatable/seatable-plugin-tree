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
  let collaborator;
  if (typeof value === 'string') {
    collaborator = collaborators.find((c: ICollaborator) => c.email === value);
  } else {
    collaborator = collaborators.find((c: ICollaborator) => c.email === value[0]);
  }

  return (
    <div className={`${containerClassName} ${style.collaborator}`}>
      <img src={collaborator?.avatar_url} alt={collaborator?.name} />
      <p style={{ marginBottom: 0 }}>{collaborator?.name}</p>
    </div>
  );
};

export default CollaboratorFormatter;
