import { toast as sonnerToast } from 'sonner';

export function toast({ title, description, ...options } = {}) {
  const message = title || description || '';
  return sonnerToast(message, {
    description,
    ...options,
  });
}
