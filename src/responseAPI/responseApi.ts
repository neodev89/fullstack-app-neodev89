export interface ResponseApiProps<T> {
    success: boolean;
    message: string;
    data: T;
    status: number;
}

export const responseApiObj = <T,>(props: ResponseApiProps<T>): ResponseApiProps<T> => {
    return {
        success: props.success,
        message: props.message,
        data: props.data,
        status: props.status,
    }
};