import { Control, FieldValues, Path } from "react-hook-form";

export type controlledInputProps<T extends object> = FieldValues & {
    control: Control<T>;
    name: Path<T>;
    type: "text" | "number" | "email" | "password" | "date";
    values: unknown;
}