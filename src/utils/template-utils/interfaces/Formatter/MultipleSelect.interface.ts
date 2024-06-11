export interface IMultipleSelectOptions {
    color: string;
    id: string;
    name: string;
    textColor: string;
}

export interface IMultipleSelectProps {
    options: IMultipleSelectOptions[];
    value: string | string[];
    isSingle: boolean;
}