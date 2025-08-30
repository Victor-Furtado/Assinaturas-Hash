"use client"

import { listSignedDocumentsAction, uploadDocumentAction } from "@/app/actions/documents"
import { SignedDoc } from "@/types/document"
import { useEffect, useState } from "react"

export default function AdminDocumentsPage() {
  const [docs, setDocs] = useState<SignedDoc[]>([])
  const [error, setError] = useState("")
  const [success, setSuccess] = useState("")
  const [loading, setLoading] = useState(false)

  async function loadDocs() {
    const res = await listSignedDocumentsAction()
    if (res.error) {
      setError(res.error)
    } else {
      setDocs(res.docs ?? [])
    }
  }

  useEffect(() => {
    loadDocs()
  }, [])

  async function handleUpload(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError("")
    setSuccess("")
    setLoading(true)

    const form = e.currentTarget
    const formData = new FormData(form)

    const res = await uploadDocumentAction({}, formData)

    setLoading(false)

    if (res.error) {
      setError(res.error)
    } else {
      setSuccess("Documento enviado com sucesso!")
      form.reset()
      loadDocs()
    }
  }

  return (
    <main className="min-h-[100dvh] p-4 bg-gray-50">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-sm p-6 space-y-6">
        <h1 className="text-lg font-semibold text-center">Gerenciamento de Documentos</h1>

        <section>
          <h2 className="text-base font-medium mb-2">Upload de Documento</h2>
          <form onSubmit={handleUpload} className="space-y-3">
            <input
              type="text"
              name="name"
              placeholder="Nome do documento"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <input
              type="file"
              name="file"
              accept="application/pdf"
              required
              className="w-full border rounded px-3 py-2 text-sm"
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full px-4 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm disabled:opacity-50"
            >
              {loading ? "Enviando..." : "Enviar"}
            </button>
          </form>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          {success && <p className="text-sm text-green-600 mt-2">{success}</p>}
        </section>

        <section>
          <h2 className="text-base font-medium mb-2">Documentos Assinados</h2>
          {error && !success && <p className="text-sm text-red-600">{error}</p>}

          {docs.length === 0 && !error ? (
            <p className="text-sm text-gray-500">Nenhum documento assinado.</p>
          ) : (
            <div className="space-y-3 md:overflow-x-auto">
              <div className="md:hidden space-y-2">
                {docs.map((d) => (
                  <div key={d.documentId} className="border rounded-lg p-3 bg-gray-50 shadow-sm">
                    <p><strong>ID:</strong> {d.documentId}</p>
                    <p><strong>Nome:</strong> {d.documentName}</p>
                    <p><strong>Data Assinatura:</strong> {new Date(d.signedAt).toLocaleString()}</p>
                    <p><strong>CPF:</strong> {d.signerCpf}</p>
                    <p className="break-all"><strong>Hash:</strong> {d.signatureHash}</p>
                  </div>
                ))}
              </div>

              <div className="hidden md:block overflow-x-auto">
                <table className="min-w-full text-sm border">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border px-2 py-1 text-left">ID</th>
                      <th className="border px-2 py-1 text-left">Nome</th>
                      <th className="border px-2 py-1 text-left">Data Assinatura</th>
                      <th className="border px-2 py-1 text-left">CPF</th>
                      <th className="border px-2 py-1 text-left">Hash</th>
                    </tr>
                  </thead>
                  <tbody>
                    {docs.map((d) => (
                      <tr key={d.documentId}>
                        <td className="border px-2 py-1">{d.documentId}</td>
                        <td className="border px-2 py-1">{d.documentName}</td>
                        <td className="border px-2 py-1">{new Date(d.signedAt).toLocaleString()}</td>
                        <td className="border px-2 py-1">{d.signerCpf}</td>
                        <td className="border px-2 py-1">{d.signatureHash}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  )
}
