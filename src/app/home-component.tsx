'use client'
import { Controller, useForm } from "react-hook-form";
import { formSchema, formType, ResponseAPISchema } from "../zod/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";

export default function HomeComponent() {
  const router = useRouter();

  const initialState: formType = {
    name: "",
    lastName: "",
    address: {
      country: "",
      city: "",
      street: "",
      civicNum: ""
    },
    prePhone: "",
    phone: "",
    email: "",
    pw: "",
  };

  const { control, handleSubmit } = useForm<formType>({
    defaultValues: initialState,
    resolver: zodResolver(formSchema),
  });

  const handleSubmitForm = async (data: formType) => {
    try {
      const response = await fetch("http://127.0.0.1:8000/api/save-user", {
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
        cache: "reload"
      });
      if (response.status === 200) {
        const res = await response.json();
        const parsed = await ResponseAPISchema.parseAsync(res);
        if (!parsed) {
          console.log("La forma della response non è adatta allo schema Zod");
          return;
        }
        const resCook = await fetch("/api/user-cookies/post", {
          method: 'post',
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(parsed.data.data_user["email"])
        })
        if (!resCook) {
          router.push("/");
          return;
        };
        router.push(`${parsed.data.id}/dashboard`)
        return parsed.data;
      }
      if (response.status === 409) {
        console.log("utente già presente nel database");
        return;
      }
    } catch (error: Error | unknown) {
      const err = error instanceof Error ? error.message : error;
      console.log("Errore nella chiamata API, ", err);
      return err;
    }
  }

  return (
    <div className="flex flex-col w-full h-full items-center justify-center font-sans bg-black p-5">
      <div className="relative flex w-full h-12">
        Accedi alle funzionalità inviando alcuni dati essenziali a farti riconoscere
      </div>
      <hr className="text-amber-200 w-full h-0.5" />
      <div className="relative flex w-full justify-center bg-black border border-red-500 text-white font-medium text-base">
        <form className="relative flex flex-row flex-wrap gap-2 h-full w-full justify-center border border-amber-50" onSubmit={handleSubmit(handleSubmitForm)}>
          <Controller
            control={control}
            name={'name'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Name" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'lastName'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Last name" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'address.country'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Country" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'address.city'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="City" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'address.street'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Street" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'address.civicNum'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Civic Number" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'prePhone'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Prefix phone" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'phone'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="text" placeholder="Phone" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'email'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="email" placeholder="email" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <Controller
            control={control}
            name={'pw'}
            render={({ field, fieldState }) => (
              <>
                {fieldState.error && <span>{fieldState.error.message}</span>}
                <input type="password" placeholder="password" className="px-2 bg-white text-black h-15 w-1/3 rounded-2xl border border-black" value={field.value} onChange={field.onChange} />
              </>
            )}
          />
          <button type="submit" className="relative flex items-center justify-center border-2 border-amber-100 h-10 w-1/2 rounded-2xl min-w-28 cursor-pointer">Invia</button>
        </form>
      </div>
    </div>
  );
}
