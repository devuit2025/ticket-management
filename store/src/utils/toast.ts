import Toast from 'react-native-toast-message';

type ToastType = 'success' | 'error' | 'info';

export const showToast = (type: ToastType, message: string, title?: string) => {
    Toast.show({
        type,
        text1: title || capitalize(type),
        text2: message,
        position: 'top',
    });
};

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
