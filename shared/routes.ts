import { z } from 'zod';
import type { Location } from './data';

const locationSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  latitude: z.number(),
  longitude: z.number(),
  category: z.string(),
  locationType: z.enum(["operation", "exercise"]),
  imageUrl: z.string().nullable(),
}) satisfies z.ZodType<Location>;

export const api = {
  locations: {
    list: {
      method: 'GET' as const,
      path: '/api/locations',
      responses: {
        200: z.array(locationSchema),
      },
    },
    get: {
      method: 'GET' as const,
      path: '/api/locations/:id',
      responses: {
        200: locationSchema,
        404: z.object({ message: z.string() }),
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
