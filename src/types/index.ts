export interface LogEntry {
  id: string
  user_id: string
  key: string
  value: any
  created_at: string
  updated_at: string
}

export interface CreateLogRequest {
  key: string
  value: any
}

export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface PaginatedResponse<T> {
  data: T[]
  count: number
  hasMore: boolean
}
