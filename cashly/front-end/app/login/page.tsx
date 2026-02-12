"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/lib/redux/hooks";
import { login } from "@/lib/redux/slices/authSlice";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";
import { addToast, Card, CardHeader, CardBody, Form, Input, Button, CardFooter, Link } from "@heroui/react";

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => setIsVisible(!isVisible);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await dispatch(login({ email: email, password: password })).unwrap();

      // Se il login ha successo, reindirizza alla dashboard
      router.push("/dashboard");
    } catch (err) {
      addToast({
        title: "Login failed",
        description: (err as AxiosError)?.message || "Credenziali non valide. Riprova.",
        severity: "warning",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center h-dvh">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold">Bentornato</h1>
          <p className="text-sm text-default-500">Accedi al tuo account per continuare</p>
        </CardHeader>

        <CardBody className="px-6 py-4">
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input value={email} onValueChange={setEmail} label="Email" type="email" variant="faded" required />

            <Input
              value={password}
              onValueChange={setPassword}
              label="Password"
              type={isVisible ? "text" : "password"}
              required
              variant="faded"
              endContent={
                <button className="focus:cursor-pointer" type="button" onClick={toggleVisibility}>
                  {isVisible ? <EyeSlashIcon className="size-6" /> : <EyeIcon className="size-6" />}
                </button>
              }
            />

            <Button type="submit" color="primary" size="lg" isLoading={isLoading} className="w-full">
              {isLoading ? "Accesso in corso..." : "Accedi"}
            </Button>
          </Form>
        </CardBody>

        <CardFooter className="flex justify-center px-6 pb-6">
          <p className="text-sm text-default-500">
            Non hai un account?
            <Link href="/signup" size="sm" className="pl-2">
              Registrati
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
