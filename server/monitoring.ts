export function initMonitoring() {
  if (process.env.NODE_ENV === "production") {
    console.log("Monitoring initialized for production");
  }
}

export function captureError(error: Error, context?: any) {
  console.error("Error captured:", error.message, context);
  
  if (process.env.NODE_ENV === "production") {
    // Send to monitoring service (Sentry, etc.)
  }
}

export function logPerformance(operation: string, duration: number) {
  if (duration > 1000) {
    console.warn(`Slow operation: ${operation} took ${duration}ms`);
  }
}
