export interface IFile {
    name: string;
    size: number;
    type: string
    upload_time: string;
    url: string;
}

export interface IFileProps {
    value: IFile[];
}