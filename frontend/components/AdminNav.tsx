"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"

export default function AdminNav() {
  const pathname = usePathname()

  const links = [
    { href: "/admin/upload", label: "Cadastrar Documento" },
    { href: "/admin/documents", label: "Lista de Documentos" },
  ]

  return (
    <nav className="flex gap-2 mb-4">
      {links.map((l) => {
        const active = pathname === l.href
        return (
          <Link
            key={l.href}
            href={l.href}
            className={`px-3 py-2 rounded-lg text-sm ${
              active ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {l.label}
          </Link>
        )
      })}
    </nav>
  )
}
