"use client"

import { useEffect, useState } from "react"
import { listAvailableDocumentsAction, signDocumentAction } from "@/app/actions/user-documents"
import { PublicDoc } from "@/types/document"

export default function UserDocumentsPage() {
  const [docs, setDocs] = useState<PublicDoc[]>([])
  const [cpf, setCpf] = useState("")
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadDocs() {
    const res = await listAvailableDocumentsAction()
    if (res.error) {
      setError(res.error)
    } else {
      setDocs(res.docs ?? [])
    }
  }

  useEffect(() => {
    loadDocs()
  }, [])

  async function handleSign(docId: string, e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const formData = new FormData(e.currentTarget)
    formData.append("id", docId)

    const res = await signDocumentAction({}, formData)

    setLoading(false)
    if (res.error) {
      setError(res.error)
    } else {
      setSuccess("Documento assinado com sucesso!")
      setCpf("")
      loadDocs()
    }
  }

  return (
    <main className="min-h-[100dvh] p-4 bg-gray-50">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <h1 className="text-lg font-semibold">Documentos Disponíveis</h1>

        {error && <p className="text-sm text-red-600">{error}</p>}
        {success && <p className="text-sm text-green-600">{success}</p>}

        {docs.length === 0 ? (
          <p className="text-sm text-gray-500">Nenhum documento disponível.</p>
        ) : (
          <ul className="space-y-4">
            {docs.map((d) => (
              <li key={d.id} className="border rounded p-4">
                <h2 className="font-medium">{d.name}</h2>
                <form onSubmit={(e) => handleSign(d.id, e)} className="flex items-center gap-2 mt-2">
                  <input
                    type="text"
                    name="cpf"
                    placeholder="Digite seu CPF"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                    className="border rounded px-2 py-1 text-sm flex-1"
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="px-3 py-1 bg-green-600 text-white rounded text-sm disabled:opacity-50"
                  >
                    {loading ? "Assinando..." : "Assinar"}
                  </button>
                </form>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  )
}
