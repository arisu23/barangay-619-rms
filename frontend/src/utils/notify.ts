import { toast } from 'react-toastify';

/**
 * Consistent toast notifications for the entire app.
 * Usage:
 *   import { notify } from '../utils/notify';
 *   notify.success('Record saved!');
 *   notify.error('Something went wrong.');
 *   notify.info('Processing your request...');
 *   notify.warn('This action cannot be undone.');
 */
export const notify = {
  success: (message: string) =>
    toast.success(message),

  error: (message: string) =>
    toast.error(message),

  info: (message: string) =>
    toast.info(message),

  warn: (message: string) =>
    toast.warn(message),
};
