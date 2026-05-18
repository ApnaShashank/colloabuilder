import { toast } from "sonner";

interface NotifyOptions {
  persistent?: boolean;
  type?: "info" | "success" | "warning" | "error" | "critical";
  title?: string;
}

/**
 * Global notification utility that follows industry standard UX:
 * 1. Shows an immediate Toast for feedback (Temporary)
 * 2. Optionally saves a Persistent notification in the DB for history
 */
export async function notify(message: string, options: NotifyOptions = {}) {
  const { persistent = false, type = "success", title } = options;

  // 1. Show Toast (Immediate Feedback)
  const toastFn = type === "critical" 
    ? toast.error 
    : (toast as Record<string, any>)[type] || toast;
  
  toastFn(title || message, {
    description: title ? message : undefined,
    duration: 3000,
  });

  // 2. Save Persistent Notification (if requested)
  if (persistent) {
    try {
      await fetch("/api/notifications/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: title || (type.toUpperCase() + " Alert"),
          desc: message,
          type: type === "critical" ? "error" : type
        })
      });
    } catch (err) {
      console.error("Failed to save persistent notification", err);
    }
  }
}
