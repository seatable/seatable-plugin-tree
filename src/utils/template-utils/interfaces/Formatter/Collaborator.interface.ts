export interface ICollaborator {
  avatar_url: string;
  email: string;
  id_in_org: string;
  name: string;
  name_pinyin: string;
}

export interface ICollaboratorProps {
  value: string | string[];
  collaborators: ICollaborator[];
  containerClassName: string;
}
