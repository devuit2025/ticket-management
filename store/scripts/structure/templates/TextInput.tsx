import React from 'react';
import { TextInput as RNTextInput, TextInputProps, StyleSheet } from 'react-native';

const TextInput: React.FC<TextInputProps> = (props) => {
    return <RNTextInput style={styles.input} {...props} />;
};

const styles = StyleSheet.create({
    input: {
        height: 40,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        borderRadius: 5,
    },
});

export default TextInput;
