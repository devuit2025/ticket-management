import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Animated, Image, Platform } from 'react-native';
import { useTranslation } from '@i18n/useTranslation';
import viFlag from '../../../assets/flags/vi.png';
import enFlag from '@assets/flags/en.png';

interface LanguageOption {
    code: string;
    label: string;
}

const flags = {
    vi: viFlag,
    en: enFlag,
};

const languages: LanguageOption[] = [
    { code: 'en', label: 'EN' },
    { code: 'vi', label: 'VI' },
];

const LanguageSwitcher: React.FC = () => {
    const { translate, setLanguage } = useTranslation();
    const [open, setOpen] = useState(false);
    const [selected, setSelected] = useState(languages[0]);
    const slideAnim = useRef(new Animated.Value(0)).current;

    const toggleDropdown = () => setOpen((prev) => !prev);

    useEffect(() => {
        Animated.timing(slideAnim, {
            toValue: open ? 1 : 0,
            duration: 200,
            useNativeDriver: true,
        }).start();
    }, [open]);

    const handleSelect = (lang: LanguageOption) => {
        setSelected(lang);
        setLanguage(lang.code);
        setOpen(false);
    };

    // Cross-platform flag source
    const getFlagSource = (lang: string) => {
        return Platform.OS === 'web' ? flags[lang] : flags[lang];
    };

    const dropdownStyle = {
        opacity: slideAnim,
        transform: [
            {
                scaleY: slideAnim.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0, 1],
                }),
            },
        ],
    };

    return (
        <View style={[styles.container, { marginRight: 15 }]}>
            <TouchableOpacity style={styles.button} onPress={toggleDropdown} activeOpacity={0.8}>
                <Image source={getFlagSource(selected.code)} style={styles.flag} />
                <Text style={styles.label}>{selected.label}</Text>
            </TouchableOpacity>

            {open && (
                <Animated.View style={[styles.dropdown, dropdownStyle]}>
                    {languages.map((lang) => (
                        <TouchableOpacity
                            key={lang.code}
                            style={styles.option}
                            onPress={() => handleSelect(lang)}
                        >
                            <Image source={getFlagSource(lang.code)} style={styles.flag} />
                            <Text style={styles.label}>{lang.label}</Text>
                        </TouchableOpacity>
                    ))}
                </Animated.View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: { position: 'relative' },
    button: {
        flexDirection: 'row',
        alignItems: 'center',
        textAlign: 'center',
        width: 60,
        paddingHorizontal: 10,
        paddingVertical: 6,
        backgroundColor: 'white',
        borderRadius: 8,
    },
    label: { fontSize: 14, marginLeft: 6 },
    flag: { width: 20, height: 14, resizeMode: 'contain' },
    dropdown: {
        position: 'absolute',
        top: 40,
        right: 0,
        backgroundColor: '#fff',
        borderRadius: 8,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.2,
        shadowRadius: 4,
        elevation: 5,
        zIndex: 1000,
        overflow: 'hidden',
    },
    option: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderBottomColor: '#eee',
        borderBottomWidth: 1,
    },
});

export default LanguageSwitcher;
