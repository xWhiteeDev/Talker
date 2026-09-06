export type TEmitMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
export type TEmitData = Record<string, unknown> | [];
export type TEmitResult<T> =
  | { success: false; code: number; isCritical: boolean; message?: string }
  | { success: true; data?: T };
