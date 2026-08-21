import * as yup from "yup";

import type {
  ResponseWithDataAndMessage,
  User,
} from "../../../lib/utils/types.utils";

export const loginSchema = yup.object({
  username: yup.string().required("Username is required"),
  password: yup.string().required("Password is required"),
});

export async function login(
  data: unknown,
): Promise<ResponseWithDataAndMessage<User>> {
  const response = await fetch(`${import.meta.env.VITE_BASE_API}/auth/login`, {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  });
  const result = await response.json();

  if (!response.ok) {
    throw new Error(result.message);
  }

  return result;
}
