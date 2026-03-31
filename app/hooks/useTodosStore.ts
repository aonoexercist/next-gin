"use client"

import { create } from "zustand"
import { apiFetch } from "@/lib/api"

type Todo = { id: string | number; title: string; completed: boolean }

type TodosState = {
  todos: Todo[]
  load: () => Promise<void>
  add: (title: string) => Promise<void>
  toggle: (id: string | number) => Promise<void>
  remove: (id: string | number) => Promise<void>
  setTodos: (t: Todo[]) => void
}

export const useTodosStore = create<TodosState>((set, get) => ({
  todos: [],
  setTodos: (t) => set({ todos: t }),
  load: async () => {
    const res = await apiFetch("/services/todos")
    if (!res.ok) return
    const data = await res.json()
    set({ todos: data })
  },
  add: async (title) => {
    const res = await apiFetch("/services/todos", {
      method: "POST",
      body: JSON.stringify({ title }),
    })
    if (res.ok) await get().load()
  },
  toggle: async (id) => {
    const todo = get().todos.find((t) => t.id === id)
    if (!todo) return
    await apiFetch(`/services/todos/${id}`, {
      method: "PUT",
      body: JSON.stringify({ completed: !todo.completed }),
    })
    await get().load()
  },
  remove: async (id) => {
    await apiFetch(`/services/todos/${id}`, { method: "DELETE" })
    await get().load()
  },
}))

export default useTodosStore
