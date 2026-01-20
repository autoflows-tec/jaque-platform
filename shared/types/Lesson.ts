export interface Lesson {
  id: number
  created_at: string
  updated_at: string
  module_id: number
  title: string
  description: string | null
  duration_minutes: number | null
  thumbnail_url: string | null
  order_index: number
  is_published: boolean
  panda_video_id: string | null
  panda_video_url: string | null
  created_by: string | null
}

export interface LessonCreateInput {
  module_id: number
  title: string
  description?: string | null
  duration_minutes?: number | null
  thumbnail_url?: string | null
  order_index?: number
  is_published?: boolean
  panda_video_id?: string | null
  panda_video_url?: string | null
}

export interface LessonUpdateInput {
  title?: string
  description?: string | null
  duration_minutes?: number | null
  thumbnail_url?: string | null
  order_index?: number
  is_published?: boolean
  panda_video_id?: string | null
  panda_video_url?: string | null
}
