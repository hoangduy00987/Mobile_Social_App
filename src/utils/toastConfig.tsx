import { BaseToast, ErrorToast, ToastConfig, ToastProps } from 'react-native-toast-message';

export const toastConfig: ToastConfig = {
  success: (props: ToastProps) => (
    <BaseToast
      {...props}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
    />
  ),
  error: (props: ToastProps) => (
    <ErrorToast
      {...props}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
    />
  ),
  info: (props: ToastProps) => (
    <BaseToast
      {...props}
      text1Style={{ fontSize: 16, fontWeight: 'bold' }}
      text2Style={{ fontSize: 14 }}
    />
  ),
};