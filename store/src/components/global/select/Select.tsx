import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Pressable } from 'react-native';

interface Option {
    label: string;
    value: string;
}

interface SelectProps {
    options: Option[];
    value?: string;
    onChange?: (value: string) => void;
    placeholder?: string;
}

const Select: React.FC<SelectProps> = ({ options, value, onChange, placeholder = 'Select...' }) => {
    const [open, setOpen] = useState(false);

    const selectedLabel = options.find((opt) => opt.value === value)?.label || placeholder;

    const handleSelect = (val: string) => {
        onChange?.(val);
        setOpen(false);
    };

    return (
        <View style={styles.wrapper}>
            {/* Selected Box */}
            <TouchableOpacity
                style={styles.selectBox}
                onPress={() => setOpen((prev) => !prev)}
                activeOpacity={0.7}
            >
                <Text style={value ? styles.selectedText : styles.placeholderText}>
                    {selectedLabel}
                </Text>
            </TouchableOpacity>

            {/* Dropdown */}
            {open && (
                <>
                    {/* Overlay (for outside press) */}
                    <Pressable style={styles.overlay} onPress={() => setOpen(false)} />

                    <View style={styles.dropdown}>
                        {options.map((item) => (
                            <TouchableOpacity
                                key={item.value}
                                style={styles.option}
                                onPress={() => handleSelect(item.value)}
                            >
                                <Text
                                    style={[
                                        styles.optionText,
                                        item.value === value && styles.optionSelected,
                                    ]}
                                >
                                    {item.label}
                                </Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    wrapper: {
        width: '100%',
        position: 'relative',
    },
    selectBox: {
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
    },
    selectedText: {
        fontSize: 14,
        color: '#000',
    },
    placeholderText: {
        fontSize: 14,
        color: '#888',
    },
    overlay: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'transparent',
        zIndex: 1,
    },
    dropdown: {
        marginTop: 2,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 6,
        backgroundColor: '#fff',
        position: 'absolute',
        width: '100%',
        top: 44, // below select box
        zIndex: 2,
    },
    option: {
        padding: 10,
    },
    optionText: {
        fontSize: 14,
        color: '#000',
    },
    optionSelected: {
        fontWeight: 'bold',
        color: '#4a90e2',
    },
});

export default Select;
