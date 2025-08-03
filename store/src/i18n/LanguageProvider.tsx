import React, { createContext, useContext, useEffect, useState } from 'react';
import i18n from './index';
import AsyncStorage from '@react-native-async-storage/async-storage';

type Language = 'en' | 'vi';

type ContextType = {
    language: Language;
    changeLanguage: (lang: Language) => void;
};

const LanguageContext = createContext<ContextType>({
    language: 'en',
    changeLanguage: () => {},
});

export const LanguageProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [language, setLanguage] = useState<Language>('en');

    useEffect(() => {
        AsyncStorage.getItem('appLanguage').then((lang) => {
            const selectedLang = (lang as Language) || i18n.locale;
            i18n.locale = selectedLang;
            setLanguage(selectedLang);
        });
    }, []);

    const changeLanguage = async (lang: Language) => {
        i18n.locale = lang;
        setLanguage(lang);
        await AsyncStorage.setItem('appLanguage', lang);
    };

    return (
        <LanguageContext.Provider value={{ language, changeLanguage }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
