type NotificationEvent =
  | "request_created"
  | "request_approved"
  | "request_rejected"
  | "asset_assigned"
  | "warranty_expiring"
  | "asset_overdue"
  | "user_created";

export async function queueNotification(event: NotificationEvent, payload: Record<string, unknown>) {
  // Placeholder for BullMQ/Celery integration.
  // Keep as async boundary so controllers can enqueue without blocking API latency.
  void event;
  void payload;
}
