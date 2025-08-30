"use client"

import { useActionState } from "react"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { loginUnifiedAction } from "./actions/auth"

export default function Home() {
  const router = useRouter()
  const [state, action, pending] = useActionState(loginUnifiedAction, { error: "" })

  // redireciona automaticamente quando login é bem-sucedido
  useEffect(() => {
    if (state?.success && state.role) {
      if (state.role === "ADMIN") router.replace("/admin")
      if (state.role === "USER") router.replace("/user")
    }
  }, [state, router])

  return (
    <main className="min-h-[100dvh] grid place-items-center bg-gray-50 p-4">
      <form
        action={action}
        className="w-full max-w-md bg-white p-6 rounded-2xl shadow-sm space-y-4"
      >
        <h1 className="text-xl font-semibold text-center">
          Plataforma de Assinatura Digital
        </h1>
        <p className="text-gray-600 text-sm text-center">
          Faça login para acessar o sistema
        </p>

        {state?.error && (
          <p className="text-sm text-red-600 text-center">{state.error}</p>
        )}

        <input
          type="email"
          name="email"
          placeholder="Email"
          className="w-full rounded-xl border px-4 py-2"
        />
        <input
          type="password"
          name="password"
          placeholder="Senha"
          className="w-full rounded-xl border px-4 py-2"
        />

        <select
          name="role"
          className="w-full rounded-xl border px-4 py-2"
          defaultValue="USER"
        >
          <option value="USER">Usuário Final</option>
          <option value="ADMIN">Administrador</option>
        </select>

        <button
          type="submit"
          disabled={pending}
          className="w-full rounded-xl bg-blue-600 text-white py-2 disabled:opacity-50"
        >
          {pending ? "Entrando..." : "Entrar"}
        </button>
      </form>
    </main>
  )
}
