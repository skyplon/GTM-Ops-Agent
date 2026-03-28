import { useState, useEffect } from "react"

export type ToastProps = {
  id?: string
  title?: string
  description?: string
  variant?: "default" | "destructive"
}

let memoryState: ToastProps[] = []
let listeners: ((state: ToastProps[]) => void)[] = []

export function toast(props: ToastProps) {
  const id = Math.random().toString(36).substring(2, 9)
  const newToast = { ...props, id }
  memoryState = [newToast, ...memoryState].slice(0, 5)
  listeners.forEach((listener) => listener(memoryState))

  setTimeout(() => {
    memoryState = memoryState.filter((t) => t.id !== id)
    listeners.forEach((listener) => listener(memoryState))
  }, 5000)
}

export function useToast() {
  const [toasts, setToasts] = useState<ToastProps[]>(memoryState)

  useEffect(() => {
    listeners.push(setToasts)
    return () => {
      listeners = listeners.filter((l) => l !== setToasts)
    }
  }, [])

  return { toasts, toast }
}
