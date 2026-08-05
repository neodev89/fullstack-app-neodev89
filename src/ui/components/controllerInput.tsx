import { Control, Controller, FieldValues, Path } from "react-hook-form";

type controlledInputProps<T extends object> = FieldValues & {
    control: Control<T>;
    name: Path<T>;
    type: "text" | "number" | "email" | "password" | "date";
    values: unknown;
}

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