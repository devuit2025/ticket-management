import i18n from './index';

export const useTranslation = () => {
    const safeLocale = i18n?.locale ?? 'en'; // fallback just in case

    return {
        translate: (key: string, config?: Record<string, unknown>) => i18n.t(key, config),
        locale: safeLocale,
    };
};
