"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";
import { useAppDispatch } from "@/lib/redux/hooks";
import { login, signup } from "@/lib/redux/slices/authSlice"; // Nota: probabilmente dovrebbe essere 'signup' o 'register'
import { addToast } from "@heroui/toast";
import { Form } from "@heroui/form";
import { Card, CardHeader, CardBody, CardFooter } from "@heroui/card";
import { Button } from "@heroui/button";
import { Link } from "@heroui/link";
import { Input } from "@heroui/input";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/solid";

interface ValidationErrors {
  email?: string;
  password?: string;
  confirmPassword?: string;
}

export default function SignupPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState({
    email: false,
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = () => setIsPasswordVisible(!isPasswordVisible);

  // Funzioni di validazione
  const validateEmail = (value: string): string => {
    if (!value) {
      return "L'email è obbligatoria";
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return "Inserisci un indirizzo email valido";
    }
    return "";
  };

  const validatePassword = (value: string): string => {
    if (!value) {
      return "La password è obbligatoria";
    }
    if (value.length < 8) {
      return "La password deve contenere almeno 8 caratteri";
    }
    if (!/(?=.*[a-z])/.test(value)) {
      return "La password deve contenere almeno una lettera minuscola";
    }
    if (!/(?=.*[A-Z])/.test(value)) {
      return "La password deve contenere almeno una lettera maiuscola";
    }
    if (!/(?=.*\d)/.test(value)) {
      return "La password deve contenere almeno un numero";
    }
    if (!/(?=.*[@$!%*?&])/.test(value)) {
      return "La password deve contenere almeno un carattere speciale (@$!%*?&)";
    }
    return "";
  };

  const validateConfirmPassword = (value: string, passwordValue: string): string => {
    if (!value) {
      return "Conferma la password";
    }
    if (value !== passwordValue) {
      return "Le password non corrispondono";
    }
    return "";
  };

  // Gestione del cambio valori con validazione
  const handleEmailChange = (value: string) => {
    setEmail(value);
    if (touched.email) {
      setErrors((prev) => ({
        ...prev,
        email: validateEmail(value),
      }));
    }
  };

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    if (touched.password) {
      setErrors((prev) => ({
        ...prev,
        password: validatePassword(value),
      }));
    }
    // Rivalidare conferma password se già toccato
    if (touched.confirmPassword && confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(confirmPassword, value),
      }));
    }
  };

  const handleConfirmPasswordChange = (value: string) => {
    setConfirmPassword(value);
    if (touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateConfirmPassword(value, password),
      }));
    }
  };

  // Gestione del blur per mostrare errori
  const handleBlur = (field: keyof typeof touched) => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    switch (field) {
      case "email":
        setErrors((prev) => ({
          ...prev,
          email: validateEmail(email),
        }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: validatePassword(password),
        }));
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword: validateConfirmPassword(confirmPassword, password),
        }));
        break;
    }
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      email: validateEmail(email),
      password: validatePassword(password),
      confirmPassword: validateConfirmPassword(confirmPassword, password),
    };

    setErrors(newErrors);
    setTouched({
      email: true,
      password: true,
      confirmPassword: true,
    });

    return !newErrors.email && !newErrors.password && !newErrors.confirmPassword;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Nota: probabilmente dovrebbe essere dispatch(signup({ ... }))
      await dispatch(signup({ email: email, password: password })).unwrap();

      addToast({
        title: "Registrazione completata",
        description: "Account creato con successo!",
        severity: "success",
      });

      // Probabilmente dovrebbe essere "/dashboard" o simile dopo la registrazione
      router.push("/dashboard");
    } catch (err) {
      addToast({
        title: "Registrazione fallita",
        description: (err as AxiosError)?.message || "Errore durante la registrazione. Riprova.",
        severity: "danger",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-dvh p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="flex flex-col gap-1 px-6 pt-6">
          <h1 className="text-2xl font-bold">Crea il tuo account</h1>
          <p className="text-small text-default-500">Inserisci i tuoi dati per registrarti</p>
        </CardHeader>

        <CardBody className="px-6 py-4">
          <Form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <Input
              value={email}
              onValueChange={handleEmailChange}
              onBlur={() => handleBlur("email")}
              label="Email"
              type="email"
              variant="faded"
              isInvalid={touched.email && !!errors.email}
              errorMessage={touched.email && errors.email}
              required
            />

            <Input
              value={password}
              onValueChange={handlePasswordChange}
              onBlur={() => handleBlur("password")}
              label="Password"
              type={isPasswordVisible ? "text" : "password"}
              variant="faded"
              isInvalid={touched.password && !!errors.password}
              errorMessage={touched.password && errors.password}
              description="Minimo 8 caratteri, con maiuscole, minuscole, numeri e simboli"
              required
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={isPasswordVisible ? "Nascondi password" : "Mostra password"}>
                  {isPasswordVisible ? <EyeSlashIcon className="size-5 text-default-400" /> : <EyeIcon className="size-5 text-default-400" />}
                </button>
              }
            />

            <Input
              value={confirmPassword}
              onValueChange={handleConfirmPasswordChange}
              onBlur={() => handleBlur("confirmPassword")}
              label="Conferma Password"
              type={isPasswordVisible ? "text" : "password"}
              variant="faded"
              isInvalid={touched.confirmPassword && !!errors.confirmPassword}
              errorMessage={touched.confirmPassword && errors.confirmPassword}
              required
              endContent={
                <button
                  className="focus:outline-none"
                  type="button"
                  onClick={togglePasswordVisibility}
                  aria-label={isPasswordVisible ? "Nascondi password" : "Mostra password"}>
                  {isPasswordVisible ? <EyeSlashIcon className="size-5 text-default-400" /> : <EyeIcon className="size-5 text-default-400" />}
                </button>
              }
            />

            <Button type="submit" color="primary" size="lg" isLoading={isLoading} className="w-full mt-2" isDisabled={isLoading}>
              {isLoading ? "Registrazione in corso..." : "Registrati"}
            </Button>
          </Form>
        </CardBody>

        <CardFooter className="flex justify-center px-6 pb-6">
          <p className="text-sm text-default-500">
            Hai già un account?
            <Link href="/login" size="sm" className="pl-2">
              Accedi
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
