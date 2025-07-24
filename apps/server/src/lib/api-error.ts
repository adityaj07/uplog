import type { StatusCode } from "@uplog/types/common/index";

export class ApiError extends Error {
  readonly status: number;
  readonly label: string;
  readonly code: number;
  readonly details?: Record<string, unknown>;

  constructor(
    message: string,
    status: StatusCode,
    details?: Record<string, unknown>
  ) {
    super(message);
    this.status = status.code;
    this.label = status.label;
    this.code = status.code; // Used on frontend to match errors
    this.details = details;
  }
}
