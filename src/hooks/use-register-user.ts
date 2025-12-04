import { useMutation } from "@tanstack/react-query";

export interface RegisterUserPayload {
  fullName: string;
  email: string;
  passwordHash: string;
  role: "SELLER" | "LEAD_MANAGER" | "ADMIN";
  userIdentifier: string;
}

export const useRegisterUser = () => {
  const baseUrl = process.env.NEXT_PUBLIC_API_URL;

  return useMutation({
    mutationFn: async (data: RegisterUserPayload) => {
      const res = await fetch(`${baseUrl}/users`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        const error = await res.json().catch(() => ({}));
        throw new Error(error?.message || "Error al registrar usuario");
      }

      return res.json();
    },
  });
};
