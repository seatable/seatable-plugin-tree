import { ICollaborator, ICollaboratorProps } from '@/utils/template-utils/interfaces/Formatter/Collaborator.interface';
import React from 'react';

const CollaboratorFormatter: React.FC<ICollaboratorProps> = ({ value, containerClassName, collaborators }) => {
  let collaborator;
  if (typeof value === 'string') {
    collaborator = collaborators.find((c: ICollaborator) => c.email === value);
  } else {
    collaborator = collaborators.find((c: ICollaborator) => c.email === value[0]);
  }

  return (
    <div className={`${containerClassName}`}>
      <img src={collaborator?.avatar_url} alt={collaborator?.name} />
      {collaborator?.name}
    </div>
  );
};

export default CollaboratorFormatter;
