"use client"

import React, { useEffect, useState } from "react"
import useTodosStore from "@/hooks/useTodosStore"

export default function Todos() {
  const { todos, load, add, toggle, remove } = useTodosStore()
  const [title, setTitle] = useState("")

  useEffect(() => {
    load()
  }, [load])

  async function handleAdd(e?: React.FormEvent) {
    e?.preventDefault()
    if (!title.trim()) return
    await add(title.trim())
    setTitle("")
  }

  const handleRemove = async (id: string | number) => {
    if (confirm("Are you sure you want to delete this todo?")) {
      await remove(id)
    }
  }

  return (
    <div className="bg-white p-5 rounded-xl shadow border">
      <h2 className="text-lg text-gray-500 font-semibold mb-3">Todos</h2>
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <input
          className="flex-1 border rounded px-3 py-2 text-gray-500"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="New todo title"
        />
        <button className="px-3 py-2 bg-blue-600 text-white rounded">Add</button>
      </form>

      <ul className="space-y-2">
        {todos.map((t) => (
          <li key={t.id.toString()} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                checked={t.completed}
                onChange={() => toggle(t.id)}
              />
              <span className={`${t.completed ? "line-through text-slate-500" : ""} text-gray-500`}>
                {t.title}
              </span>
            </div>
            <div>
              <button
                onClick={() => handleRemove(t.id)}
                className="text-sm text-red-500 hover:underline"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  )
}
