import {
  ICollaborator,
  ICollaboratorProps,
} from '@/utils/template-utils/interfaces/Formatter/Collaborator.interface';
import React from 'react';
import style from '../../../../styles/template-styles/formatter/Collaborator.module.scss';

const CollaboratorFormatter: React.FC<ICollaboratorProps> = ({ value, collaborators }) => {
  // If value is a string, treat it as a single-element array
  const values = Array.isArray(value) ? value : [value];

  // Find all collaborators that match the emails in the value array
  const matchedCollaborators = values.map((val) => {
    const collaborator = collaborators.find((c: ICollaborator) => c.email === val);
    return collaborator ? { ...collaborator } : { email: val }; // Keep email even if not found
  });

  return (
    <>
      {matchedCollaborators.map((collaborator, index) => (
        <div key={index} className={style.collaborator}>
          {isFullCollaborator(collaborator) && collaborator.avatar_url ? (
            <img src={collaborator.avatar_url} alt={collaborator.name} />
          ) : (
            // Render an empty gray circle if the collaborator or avatar is missing
            <div className={style.emptyAvatar}></div>
          )}
          <p>{isFullCollaborator(collaborator) ? collaborator.name : ''}</p>
        </div>
      ))}
    </>
  );
};

export default CollaboratorFormatter;

// Type guard to check if collaborator has both name and avatar_url
function isFullCollaborator(collaborator: {
  email: string;
  name?: string;
  avatar_url?: string;
}): collaborator is ICollaborator {
  return 'name' in collaborator && 'avatar_url' in collaborator;
}
