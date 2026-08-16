import { controlledInputProps } from "@/src/types/typeControlField"
import { Controller } from "react-hook-form"

export const ControlledInput = <T extends object>({
    control, name, type, values
}: controlledInputProps<T>) => {
    return (
        <Controller
            control={control}
            name={name}
            render={({ field }) => (
                <input type={type} value={String(values)} onChange={field.onChange} />
            )}
        />
    )
}