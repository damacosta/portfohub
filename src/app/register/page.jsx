"use client";

import FormFieldInput from "@/components/custom/formFieldInput";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Form, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import useSWRMutation from "swr/mutation";
import { sendRequest } from "@/lib/sendRequest";
import { useRouter } from "next/navigation";
import { Routes } from "@/constants/routes";
import Image from "next/image";
import Link from "next/link";

const formSchema = z.object({
  fullName: z.string().refine((data) => /\w{3,} \w{3,}/.test(data), {message: "adicione nome e sobrenome"}),
  email: z.string().email({ message: "e-mail inválido" }),
  password: z
    .string()
    .min(6, { message: "a senha deve conter no mínimo 6 caracteres" })
});

export default function Register() {
  const [confirmPassword, setConfirmPassword] = useState("");
  const [confirmError, setConfirmError] = useState(false);
  const router = useRouter();
  const { trigger } = useSWRMutation("/users/register", sendRequest);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: "",
      password: ""
    }
  });

  const onChangeConfirm = (event) => {
    setConfirmPassword(event.target.value);

    if (event.target.value !== form.getValues("password")) {
      setConfirmError(true);
    } else {
      setConfirmError(false);
    }
  };

  const onSubmit = async (data) => {
    if (confirmError) return;
    try {
      await trigger({ method: "POST", data });
      toast.success("Cadastro efetuado com sucesso");
      router.push(Routes.LOGIN);
    } catch {
      toast.error("Ocorreu um erro durante o envio do cadastro");
    }
  };

  return (
    <div className="pt-20">
      <Card className="lg:w-[50%] w-full mx-auto px-10 pb-10 pt-5 bg-transparent border-none">
        <div className="w-full flex justify-center pb-10">
          <Image width={290} height={290} src="/Logotipos-white.svg" alt="" />
        </div>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <FormFieldInput
                name="fullName"
                control={form.control}
                label="Nome Completo"
              />
              <FormFieldInput
                name="email"
                control={form.control}
                label="E-mail"
                className="w-[45%]"
              />
              <div className="flex justify-between">
                <FormFieldInput
                  name="password"
                  control={form.control}
                  label="Senha"
                  className="w-[45%]"
                  inputType="password"
                />
                <div className="space-y-2 w-[45%]">
                  <Label>Confimar Senha</Label>
                  <Input
                    type="password"
                    value={confirmPassword}
                    onChange={onChangeConfirm}
                  />
                  {confirmError && (
                    <FormMessage>password incorreto</FormMessage>
                  )}
                </div>
              </div>
              <div className="flex justify-end">
                <Button type="submit">Cadastrar</Button>
              </div>
            </form>
          </Form>
          <div className="text-primary text-center w-full">
            <Link className="text-primary text-center w-full" href={Routes.LOGIN}>
              Entrar
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

