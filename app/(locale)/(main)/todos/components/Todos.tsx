"use client"

import React, { useEffect, useState } from "react"
import useTodosStore from "@/hooks/useTodosStore"

export default function Todos() {
  const { todos, load, add, toggle, remove } = useTodosStore()
  const [title, setTitle] = useState("")
  const [adding, setAdding] = useState(false)
  const [deletingId, setDeletingId] = useState<string | number | null>(null)

  useEffect(() => {
    load()
  }, [load])

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault()
    if (!title.trim()) return
    setAdding(true)
    await add(title.trim())
    setTitle("")
    setAdding(false)
  }

  async function handleRemove(id: string | number) {
    if (!confirm("Delete this todo?")) return
    setDeletingId(id)
    await remove(id)
    setDeletingId(null)
  }

  const done = todos.filter((t) => t.completed).length
  const total = todos.length
  const progress = total === 0 ? 0 : Math.round((done / total) * 100)

  return (
    <div className="bg-white/4 border border-white/8 rounded-2xl overflow-hidden">
      {/* Header */}
      <div className="px-6 py-5 border-b border-white/8">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base font-semibold text-white">Todos</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {done} of {total} completed
            </p>
          </div>
          {total > 0 && (
            <div className="flex items-center gap-3">
              <div className="w-24 h-1.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-blue-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-xs text-slate-400 tabular-nums">{progress}%</span>
            </div>
          )}
        </div>
      </div>

      {/* Add form */}
      <form onSubmit={handleAdd} className="flex gap-2 px-6 py-4 border-b border-white/5">
        <input
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 transition"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Add a new task…"
        />
        <button
          type="submit"
          disabled={adding || !title.trim()}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-500 active:scale-95 transition-all text-sm font-medium text-white rounded-xl disabled:opacity-40 disabled:pointer-events-none"
        >
          {adding ? "Adding…" : "Add"}
        </button>
      </form>

      {/* List */}
      <ul className="divide-y divide-white/5">
        {todos.length === 0 ? (
          <li className="px-6 py-10 text-center">
            <p className="text-sm text-slate-500">No tasks yet. Add one above.</p>
          </li>
        ) : (
          todos.map((t) => (
            <li
              key={t.id.toString()}
              className="flex items-center gap-4 px-6 py-3.5 hover:bg-white/3 transition-colors group"
            >
              <button
                type="button"
                onClick={() => toggle(t.id)}
                className={`shrink-0 w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all ${
                  t.completed
                    ? "bg-blue-600 border-blue-600"
                    : "border-white/20 hover:border-blue-400"
                }`}
                aria-label={t.completed ? "Mark incomplete" : "Mark complete"}
              >
                {t.completed && (
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                )}
              </button>

              <span
                className={`flex-1 text-sm transition-colors ${
                  t.completed ? "line-through text-slate-600" : "text-slate-200"
                }`}
              >
                {t.title}
              </span>

              <button
                type="button"
                onClick={() => handleRemove(t.id)}
                disabled={deletingId === t.id}
                className="opacity-0 group-hover:opacity-100 p-1 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all disabled:opacity-30"
                aria-label="Delete"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </li>
          ))
        )}
      </ul>
    </div>
  )
}
