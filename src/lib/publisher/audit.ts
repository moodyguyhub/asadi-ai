/**
 * Immutable audit log for all Publisher actions.
 */
import { prisma } from "@/lib/db";

export type AuditAction =
  | "login"
  | "connect"
  | "disconnect"
  | "upload"
  | "publish_requested"
  | "publish_succeeded"
  | "publish_failed";

export async function auditLog(params: {
  action: AuditAction;
  actor: string;
  platform?: string;
  details?: Record<string, unknown>;
}) {
  await prisma.auditLog.create({
    data: {
      action: params.action,
      actor: params.actor,
      platform: params.platform,
      details: params.details ? JSON.stringify(params.details) : undefined,
    },
  });
}
