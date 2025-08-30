'use server'

import { cookies } from "next/headers"
import { apiFetch } from "@/lib/api"
import { redirect } from "next/navigation";

type State = { error?: string; success?: boolean; role?: "ADMIN" | "USER" }
type LoginResponse = { access_token: string }

export async function loginUnifiedAction(
  _prevState: State,
  formData: FormData
): Promise<State> {
  const email = String(formData.get("email") ?? "")
  const password = String(formData.get("password") ?? "")
  const role = String(formData.get("role") ?? "USER") as "ADMIN" | "USER"

  if (!email || !password) return { error: "Preencha email e senha." }

  try {
    const data = await apiFetch<LoginResponse>(`/auth/${role.toLowerCase()}/login`, {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })

    const token = data?.access_token
    if (!token) return { error: "Token não recebido." }

    const secure = process.env.NODE_ENV === "production"
      ; (await cookies()).set("auth_token", token, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 60 * 60 * 24,
      })
      ; (await cookies()).set("auth_role", role, {
        httpOnly: true,
        sameSite: "lax",
        secure,
        path: "/",
        maxAge: 60 * 60 * 24,
      })

    return { success: true, role }
  } catch (e: any) {
    return { error: e.message ?? "Falha ao autenticar." }
  }
}

export async function logoutAction() {
  const cookieStore = cookies()
    ; (await cookieStore).delete("auth_token")
    ; (await cookieStore).delete("auth_role")

  redirect("/")
}