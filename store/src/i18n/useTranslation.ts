import i18n from './index';
import { useLanguage } from './LanguageProvider';

export const useTranslation = () => {
    const safeLocale = i18n?.locale ?? 'en'; // fallback just in case
    const {changeLanguage } = useLanguage()
    return {
        translate: (key: string, params?: Record<string, string | number>) => {
            let text = i18n.t(key, params);

            if (params) {
                Object.keys(params).forEach((k) => {
                    const value = params[k];
                    text = text.replace(new RegExp(`\\{${k}\\}`, 'g'), String(value));
                });
            }

            return text;
        },
        locale: safeLocale,
        setLanguage: (lang: string) => {
            changeLanguage(lang)
            console.log('set language:', lang);
        },
    };
};
