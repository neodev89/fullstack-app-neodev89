import { SubmitEventHandler } from "react";
import { Control } from "react-hook-form";

export interface formLoginprops<T extends object> {
    conflict: {
        state: boolean,
        message: string,
    };
    control: Control<T>;
    isLogin: 'y' | 'n';
    handleSubmit: SubmitEventHandler<HTMLFormElement> | undefined
}