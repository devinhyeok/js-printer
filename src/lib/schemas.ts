import { z } from 'zod'

export const contentTypeSchema = z.enum(['doc', 'slide'])

export type ContentType = z.infer<typeof contentTypeSchema>

export { z }
