import * as yup from 'yup';

export const loginSchema = yup.object({
    email: yup.string().email('Invalid email').required('Required'),
    password: yup.string().min(6).required('Required'),
});
