"use client";

import { useState } from "react";
import { Lock, UserRoundPen } from "lucide-react";
import { SubmitHandler, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { InferType } from "yup";

import { Button } from "@/components/atoms/button/Button";
import { Modal } from "../modal/Modal";
import { Form } from "@/components/atoms/form/Form";
import { loginSchema } from "./Header.utils";

export function DisplayLoginForm(): React.JSX.Element {
  const [showForm, setShowForm] = useState(false);

  const toggle = (): void => {
    setShowForm(!showForm);
  };

  return (
    <>
      <Button el="button" variant="primary" onClick={toggle}>
        Login
      </Button>
      {showForm && (
        <Modal state={showForm} title="Sign-in your account" onToggle={toggle}>
          <LoginForm />
        </Modal>
      )}
    </>
  );
}

function LoginForm(): React.JSX.Element {
  const [isLoading, setIsLoading] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(loginSchema),
    mode: "onBlur",
  });

  const onSubmit: SubmitHandler<InferType<typeof loginSchema>> = async (
    data,
  ): Promise<void> => {
    setIsLoading(true);

    try {
      console.log(data);
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="username">Username</Form.Label>
        <Form.Control
          type="text"
          id="username"
          {...register("username")}
          placeholder=""
          hasError={Boolean(errors.username)}
          leftIcon={<UserRoundPen width={20} height={20} />}
        />
        {Boolean(errors.username) && (
          <Form.Error>{errors.username?.message}</Form.Error>
        )}
      </Form.Group>
      <Form.Group className="mb-3">
        <Form.Label htmlFor="password">Password</Form.Label>
        <Form.Control
          type="password"
          id="password"
          {...register("password")}
          hasError={Boolean(errors.password)}
          leftIcon={<Lock width={20} height={20} />}
        />
        {Boolean(errors.password) && (
          <Form.Error>{errors.password?.message}</Form.Error>
        )}
      </Form.Group>
      <Button type="submit" variant="primary" el="button" loading={isLoading}>
        Login
      </Button>
    </Form>
  );
}
