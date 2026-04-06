import { toast, type ToastOptions, type TypeOptions } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const toastConfig: ToastOptions = {
  position: 'top-right',
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
  theme: 'colored',
};

export default function Notification(message: string, type: TypeOptions = 'default') {
  if (type === 'success') {
    return toast.success(message, toastConfig);
  }

  if (type === 'error') {
    return toast.error(message, toastConfig);
  }

  if (type === 'warning') {
    return toast.warning(message, toastConfig);
  }

  if (type === 'info') {
    return toast.info(message, toastConfig);
  }

  return toast(message, toastConfig);
}