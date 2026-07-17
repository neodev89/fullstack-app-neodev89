'use client'

import { formType } from "@/src/zod/formSchema";
import { ChangeEvent, ReactNode, useEffect } from "react";
import { Control, Controller, ControllerRenderProps, UseFormHandleSubmit, UseFormReset, UseFormSetValue } from "react-hook-form";


interface formDashboardType {
    user: formType;
    control: Control<formType>;
    reset: UseFormReset<formType>;
    handleSubmit: UseFormHandleSubmit<formType>;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    handleSubmitForm: (data: formType) => Promise<any>;
    setValue: UseFormSetValue<formType>;
    children: ReactNode;
    isDisabledPw: boolean;
}

export default function FormComponent({
    user, control, reset, handleSubmit, handleSubmitForm, setValue, children, isDisabledPw = true
}: formDashboardType) {

    const handleChange = (e: ChangeEvent<HTMLInputElement>, field: ControllerRenderProps<formType>) => {
        const { value } = e.target;
        if (value === "" || value === undefined) {
            const fallback = user[field.name as keyof formType];
            field.onChange(fallback ?? undefined)
            setValue(field.name, fallback)
            return;
        }
        field.onChange(value);
        setValue(field.name, value);
    };

    useEffect(() => {
        if (user) {
            reset(user);
        }
    }, [user, reset]);

    return (
        <div className="relative flex w-full justify-center bg-black border border-red-500 text-white font-medium text-base">
            <form className="relative flex flex-row flex-wrap gap-2 h-full w-full justify-center border border-amber-50" onSubmit={handleSubmit(handleSubmitForm)}>
                <Controller
                    control={control}
                    name={'name'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Name" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'lastName'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Last name" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'address.country'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Country" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'address.city'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="City" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'address.street'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Street" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'address.civicNum'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Civic Number" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'prePhone'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Prefix phone" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'phone'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="text" placeholder="Phone" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'email'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="email" placeholder="email" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                <Controller
                    control={control}
                    name={'pw'}
                    render={({ field, fieldState }) => (
                        <>
                            {fieldState.error && <span>{fieldState.error.message}</span>}
                            <input type="password" disabled={isDisabledPw} placeholder="password" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={(e) => handleChange(e, field)} />
                        </>
                    )}
                />
                {children}
            </form>
        </div>
    )
}