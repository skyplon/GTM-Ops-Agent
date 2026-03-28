import { useToast } from "@/hooks/use-toast"
import { AlertTriangle, CheckCircle2 } from "lucide-react"

export function Toaster() {
  const { toasts } = useToast()

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 w-full max-w-md pointer-events-none">
      {toasts.map((toast) => (
        <div
          key={toast.id}
          className={`flex items-start gap-3 p-4 rounded-xl shadow-lg border pointer-events-auto transition-all animate-in slide-in-from-bottom-5 ${
            toast.variant === "destructive"
              ? "bg-red-50 border-red-200 text-red-900"
              : "bg-white border-border text-foreground"
          }`}
        >
          {toast.variant === "destructive" ? (
            <AlertTriangle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
          ) : (
            <CheckCircle2 className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
          )}
          <div className="flex flex-col gap-1">
            {toast.title && <h3 className="font-semibold text-sm">{toast.title}</h3>}
            {toast.description && <p className="text-sm opacity-90">{toast.description}</p>}
          </div>
        </div>
      ))}
    </div>
  )
}
