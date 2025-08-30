'use server'

import { cookies } from "next/headers"
import { apiFetch } from "@/lib/api"
import { SignedDoc } from "@/types/document";

type UploadState = { error?: string; success?: boolean }

export async function uploadDocumentAction(_prevState: UploadState, formData: FormData): Promise<UploadState> {
  const file = formData.get("file") as File | null
  const name = String(formData.get("name") ?? "")

  if (!file) return { error: "Selecione um arquivo PDF." }
  if (!name) return { error: "Informe um nome para o documento." }

  const token = (await cookies()).get("auth_token")?.value
  const role = (await cookies()).get("auth_role")?.value
  if (!token || role !== "ADMIN") return { error: "Acesso restrito ao perfil ADMIN." }

  const form = new FormData()
  form.append("file", file)
  form.append("name", name)

  try {
    await apiFetch("/admin/documents", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    })

    return { success: true }
  } catch (e: any) {
    console.error(e)
    return { error: e.message ?? "Erro inesperado ao enviar documento." }
  }
}

type ListState = { error?: string; docs?: SignedDoc[] }

export async function listSignedDocumentsAction(): Promise<ListState> {
  try {
    const token = (await cookies()).get("auth_token")?.value
    const role = (await cookies()).get("auth_role")?.value
    if (!token || role !== "ADMIN") {
      return { error: "Acesso restrito ao perfil ADMIN." }
    }

    const docs = await apiFetch<SignedDoc[]>("/admin/documents/signed", {
      method: "GET",
      headers: { Authorization: `Bearer ${token}` },
    })
    console.log(docs);

    return { docs }
  } catch (e: any) {
    console.error(e)
    return { error: e.message ?? "Erro inesperado ao buscar documentos." }
  }
}