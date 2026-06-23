"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

// ponytail: login fake, solo visual, sin auth real
export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    // Simular delay de auth
    setTimeout(() => router.push("/"), 800);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-zinc-900">CliniGest</h1>
            <p className="text-zinc-500 mt-1">Centro Terapéutico</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Usuario</label>
              <input
                type="text"
                defaultValue="admin"
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="admin"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-zinc-700 mb-1">Contraseña</label>
              <input
                type="password"
                defaultValue="demo123"
                className="w-full px-4 py-3 border border-zinc-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                placeholder="••••••••"
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors font-medium"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Ingresando...
                </span>
              ) : (
                "Ingresar"
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-zinc-100">
            <p className="text-xs text-zinc-400 text-center">
              Demo de CliniGest v1.0
              <br />
              Usuario: admin / Contraseña: demo123
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
