import { useMutation } from "@tanstack/react-query";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  code: number;
  access_token: string; // <- lo que devuelve tu backend
}

export const useLogin = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return useMutation<LoginResponse, Error, LoginPayload>({
    mutationFn: async (data: LoginPayload) => {
      const res = await fetch(`${baseUrl}/auth`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || "Credenciales incorrectas");
      }

      return res.json();
    },
  });
};
