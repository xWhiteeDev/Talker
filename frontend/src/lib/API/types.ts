export type TransmitionResult = TransmitionFault | TransmitionSuccess

type TransmitionFault = { success: false, message: string }
type TransmitionSuccess = { success: true, data: Record<string, unknown> }

export type EmitMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
export type EmitData = Record<string,unknown> | []