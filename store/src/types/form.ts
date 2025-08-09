import { Control } from 'react-hook-form';
import { StyleProp, ViewStyle } from 'react-native';

export interface FormSelectOption {
    label: string;
    value: string | number;
}

export interface FormSelectProps {
    name: string;
    label: string;
    control: Control<any>;
    error?: string;
    options: FormSelectOption[];
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
}

export interface FormDatePickerProps {
    name: string;
    label: string;
    control: Control<any>;
    error?: string;
    placeholder?: string;
    containerStyle?: StyleProp<ViewStyle>;
}
