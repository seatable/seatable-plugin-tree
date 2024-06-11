export interface IRateData {
    default_value: string;
    enable_fill_default_value: boolean;
    rate_max_number: number;
    rate_style_color: string;
    rate_style_type: string;
}

export interface IRateProps {
    value: number;
    data: IRateData;
    containerClassName: string;
}