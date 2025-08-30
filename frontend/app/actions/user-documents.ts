"use server"

import { apiFetch } from "@/lib/api";
import { PublicDoc } from "@/types/document";
import { cookies } from "next/headers";

type State = { error?: string; success?: boolean }

export async function listAvailableDocumentsAction(): Promise<{ error?: string; docs?: any[] }> {
  try {
    const token = (await cookies()).get("auth_token")?.value
    if (!token) return { error: "Não autenticado." }

    const doc = await apiFetch<PublicDoc[]>("/documents/available", {
      headers: { Authorization: `Bearer ${token}` },
    })

    return { docs: doc ? [doc] : [] }
  } catch (e: any) {
    return { error: e.message ?? "Erro ao buscar documentos." }
  }
}

export async function signDocumentAction(_prev: State, formData: FormData): Promise<State> {
  try {
    const id = formData.get("id") as string
    const cpf = formData.get("cpf") as string
    if (!id || !cpf) return { error: "Documento e CPF são obrigatórios." }

    const token = (await cookies()).get("auth_token")?.value
    if (!token) return { error: "Não autenticado." }

    await apiFetch(`/documents/${id}/sign`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ cpf }),
    })

    return { success: true }
  } catch (e: any) {
    return { error: e.message ?? "Erro ao assinar documento." }
  }
}