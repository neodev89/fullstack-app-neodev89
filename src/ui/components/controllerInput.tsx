import { controlledInputProps, controlledIterateFieldProps } from "@/src/types/typeControlField"
import { Controller, Path } from "react-hook-form"

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
};

export const ControlledIteratedInput = <T extends Record<string, unknown>>({
    control,
    values,
    type
}: controlledIterateFieldProps<T>) => {

    const valueArr = Array.isArray(values) ? values : [values];

    const inferType = (
        key: string,
        value: unknown
    ): "number" | "text" | "email" | "password" | "date" | undefined => {

        // date (Date object)
        if (value instanceof Date) return "date";

        // date (string)
        if (typeof value === "string" && !isNaN(Date.parse(value))) return "date";

        // number
        if (typeof value === "number") return "number";

        // string
        if (typeof value === "string") return "text";

        return undefined;
    };

    return (
        <>
            {valueArr.map((el, idx) => {
                return Object.entries(el).map(([key, value], entryIdx) => {

                    const dynamicType =
                        type[entryIdx] ??
                        inferType(key, value) ??
                        "text";

                    const fieldName = `${key}` as Path<T>;

                    return (
                        <ControlledInput
                            key={`${idx}-${key}`}
                            control={control}
                            name={fieldName}
                            type={dynamicType}
                            values={value}
                        />
                    );
                });
            })}
        </>
    );
};
