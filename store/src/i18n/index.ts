import { I18n } from 'i18n-js';
import * as Localization from 'expo-localization';

import en from './translations/en';
import vi from './translations/vi';

const i18n = new I18n({
    en,
    vi,
});

const fallbackLocale = 'en';
const locales = Localization.getLocales?.();
const deviceLocale = locales?.[0]?.languageTag ?? fallbackLocale;

i18n.locale = deviceLocale.startsWith('vi') ? 'vi' : 'en';
i18n.enableFallback = true;

export default i18n;
