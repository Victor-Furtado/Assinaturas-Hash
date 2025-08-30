"use client"

import { useState } from "react"
import { logoutAction } from "../actions/auth"

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [pending] = useState(false)

  return (
    <main className="min-h-[100dvh] p-4 bg-gray-50 flex justify-center">
      <div className="w-full max-w-3xl bg-white p-6 rounded-2xl shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <h1 className="text-xl font-semibold">Backoffice</h1>
          <form action={logoutAction}>
            <button
              type="submit"
              disabled={pending}
              className="px-4 py-2 rounded-lg bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50"
            >
              Logout
            </button>
          </form>
        </div>
        <div>{children}</div>
      </div>
    </main>
  )
}
