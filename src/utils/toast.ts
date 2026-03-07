import { h, render } from 'vue';
import SeeToast from '../components/seeui/toast/SeeToast.vue';

type ToastType = 'success' | 'error' | 'info';

type ToastExpose = InstanceType<typeof SeeToast>;
let toastRef: ToastExpose | null = null;

function createToastInstance(): ToastExpose {
  const container = document.createElement('div');
  container.id = 'see-toast-container';
  document.body.appendChild(container);

  const vnode = h(SeeToast);
  render(vnode, container);

  return (vnode.component?.exposed as ToastExpose) || null;
}

export const toast = {
  show(message: string, type: ToastType = 'success', duration: number = 2000) {
    if (!toastRef) {
      toastRef = createToastInstance();
    }

    if (toastRef) {
      toastRef.show(message, type, duration);
    }
  },

  success(msg: string, duration?: number) {
    this.show(msg, 'success', duration);
  },

  error(msg: string, duration?: number) {
    this.show(msg, 'error', duration);
  },

  info(msg: string, duration?: number) {
    this.show(msg, 'info', duration);
  },
};
