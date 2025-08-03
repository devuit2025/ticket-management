import React from 'react';
import { View, Button } from 'react-native';
import { useLanguage } from '@i18n/LanguageProvider';

const LanguageSwitcher = () => {
    const { language, changeLanguage } = useLanguage();

    return (
        <View>
            <Button title="🇻🇳 Tiếng Việt" onPress={() => changeLanguage('vi')} />
            <Button title="🇺🇸 English" onPress={() => changeLanguage('en')} />
        </View>
    );
};

export default LanguageSwitcher;
