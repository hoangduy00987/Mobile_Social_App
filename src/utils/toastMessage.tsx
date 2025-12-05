import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

const ToastMessage = (type: ToastType, title: string, message: string) => {
  Toast.show({
    type,
    text1: title,
    text2: message,
    position: 'top',
    visibilityTime: 2000,
    autoHide: true,
  });
};

export const showSuccess = (title: string, message: string) => ToastMessage('success', title, message);
export const showError = (title: string, message: string) => ToastMessage('error', title, message);
export const showInfo = (title: string, message: string) => ToastMessage('info', title, message);