'use client'
import { Controller, useForm } from "react-hook-form";
import { formSchema, formType, loginSchema, loginType, ResponseAPISchema } from "../zod/formSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { customFetch } from "../lib/fetch/customFetch";
import { formLoginprops } from "../interfaces/formLogin";

export default function HomeComponent() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState<"y" | "n">("n");
  const [conflict, setConflict] = useState<{ state: boolean; message: string; }>({
    state: false,
    message: ""
  });
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const initialState: Omit<formType, "tk"> = {
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

  const loginInitialState: loginType = {
    email: "",
    pw: ""
  };

  const { control, handleSubmit } = useForm<Omit<formType, "tk">>({
    defaultValues: initialState,
    resolver: zodResolver(formSchema),
  });
  const { control: controlLogin, handleSubmit: handleSubLogin } = useForm<loginType>({
    defaultValues: loginInitialState,
    resolver: zodResolver(loginSchema),
  });

  const handleSubmitFormN = async (data: Omit<formType, "tk">) => {
    try {
      console.log("HandleSubmitForm chiamata")
      const path = "http://127.0.0.1:8000/api/save-user";
      const response = await customFetch({
        isPy: true,
        urlPy: `${path}`,
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(data),
      });
      const parsed = await ResponseAPISchema.parseAsync(response);
      if (!parsed) {
        console.log("La forma della response non è adatta allo schema Zod");
        return parsed;
      }
      console.log("Ecco la response: ", parsed);
      console.log("I dati di parsed sono: ", parsed.data.data_user);

      if (parsed.data.data_user !== null) {
          const resCook = await customFetch({
            isPy: false,
            url: "/user-cookies/post",
            method: 'post',
            body: JSON.stringify({ email: parsed.data.data_user.email, tk: parsed.data.data_user.tk })
          })
          console.log("La forma della res è: ", resCook);
          if (!resCook) {
            router.push("/");
            return parsed.success;
          };
          router.push(`${parsed.data.id}/dashboard`)
          return true;
        }
      
      if (parsed.status === 409) {
        console.log("utente già presente nel database: ", parsed.success);
        setConflict({
          state: parsed.success,
          message: parsed.message,
        });
        return parsed.data;
      }
      if (parsed.status === 404) {
        console.log("Qualcosa è andato storto o non è stata trovata ", parsed.message);
        setConflict({
          state: parsed.success,
          message: parsed.message,
        });
        return parsed.data;
      }
    } catch (error: Error | unknown) {
      const err = error instanceof Error ? error.message : error;
      console.log("Errore nella chiamata API, ", err);
      return err;
    }
  };

  const handleSubmitFormY = async (data: loginType) => {
    try {
      console.log("HandleSubmitForm chiamata")
      const path = "http://127.0.0.1:8000/api/login-user";
      console.log("Quale path API sto chiamando?: ", path);
      const response = await customFetch({
        isPy: true,
        urlPy: `${path}`,
        method: "post",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email: data.email, pw: data.pw }),
      });
      console.log("La response del login è: ", response);
      const parsed = await ResponseAPISchema.parseAsync(response);
      if (!parsed) {
        console.log("La forma della response non è adatta allo schema Zod");
        return parsed;
      }
      console.log("Ecco la response: ", parsed);

      if (parsed.status === 200 && parsed.data.data_user) {
        setIsLoading(true);
        const resCook = await customFetch({
          isPy: false,
          url: "/user-cookies/post",
          method: 'post',
          body: JSON.stringify({ email: parsed.data.data_user.email, token: isLogin ? parsed.data.data_user.tk : undefined })
        })
        if (!resCook) {
          router.push("/");
          return parsed.success;
        };
        router.push(`${parsed.data.id}/dashboard`)
        return true;
      }
      if (parsed.status === 409) {
        console.log("utente già presente nel database: ", parsed.success);
        setConflict({
          state: true,
          message: parsed.message,
        });
        return parsed.data;
      }
    } catch (error: Error | unknown) {
      const err = error instanceof Error ? error.message : error;
      console.log("Errore nella chiamata API, ", err);
      return err;
    }
  }

  const handleIsLogin = () => {
    if (isLogin === "n") {
      setIsLogin("y");
    } else {
      setIsLogin("n");
    }
  };

  useEffect(() => {
    console.log(isLogin);
  }, [isLogin]);

  return (
    <div className="flex flex-col flex-1 items-center justify-center font-sans bg-black p-5">
      {
        isLoading ? (
          <div className="relative flex flex-1 bg-white">
            <p className="text-black text-lg">Attendi il caricamento...</p>
          </div>
        ) : (
          <>
            <div className="relative flex w-full h-12">
              <p className="text-white">Accedi alle funzionalità inviando alcuni dati essenziali a farti riconoscere</p>
            </div>
            <hr className="text-amber-200 w-full h-0.5" />
            <p className="text-white">Seleziona se sei registrato o no</p>
            <button type="button" className="relative flex items-center justify-center border-2 border-amber-100 h-10 w-1/2 rounded-2xl min-w-28 cursor-pointer" onClick={handleIsLogin}>
              <p className="text-white">
                {isLogin === "n" ? "Non sono registrato" : "Sì, sono registrato"}
              </p>
            </button>
            <div className="relative flex flex-col w-full justify-center bg-black border border-red-500 text-white font-medium text-base">
              {
                isLogin === 'y' ?
                  (<FormYesSignUp control={controlLogin} conflict={conflict} isLogin={isLogin} handleSubmit={handleSubLogin(handleSubmitFormY)} />) :
                  (<FormNoSignUp control={control} conflict={conflict} isLogin={isLogin} handleSubmit={handleSubmit(handleSubmitFormN)} />)
              }
              <span className="text-white h-auto w-full">{conflict.message}</span>
            </div>
          </>
        )
      }
    </div>
  );
}

const FormNoSignUp = ({ control, conflict, isLogin, handleSubmit }: formLoginprops<Omit<formType, "tk">>) => {
  return (
    <form className="relative flex flex-row flex-wrap gap-2 h-full w-full justify-center border border-amber-50" onSubmit={handleSubmit}>
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
      {(isLogin === "n" && !conflict.state) && (
        <button type="submit" className="relative flex items-center justify-center border-2 border-amber-100 h-10 w-1/2 rounded-2xl min-w-28 cursor-pointer">
          Invia
        </button>
      )}
    </form>
  )
};

const FormYesSignUp = ({ control, conflict, isLogin, handleSubmit }: formLoginprops<loginType>) => {
  return (
    <form className="relative flex flex-row flex-wrap gap-2 h-full w-full justify-center border border-amber-50" onSubmit={handleSubmit}>
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
      {(conflict.state || isLogin === "y") && (
        <>
          {conflict.message !== "" && <p className="relative flex items-center justify-center border-2 border-amber-100 h-10 w-1/2 text-white">{conflict.message}</p>}
          <button type="submit" className="relative flex items-center justify-center border-2 border-amber-100 h-10 w-1/2 rounded-2xl min-w-28 cursor-pointer!">Accedi</button>
        </>
      )}
    </form>
  )
} 