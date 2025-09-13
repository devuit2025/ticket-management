import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Select from '@components/global/select/Select';

interface FilterSelectProps {
    label: string;
    options: { label: string; value: string }[];
    value: string | undefined;
    onChange: (value: string) => void;
}

const FilterSelect: React.FC<FilterSelectProps> = ({ label, options, value, onChange }) => {
    return (
        <View style={styles.column}>
            <Text style={styles.label}>{label}</Text>
            <Select
                options={options}
                value={value}
                onChange={onChange}
                placeholder={`Choose ${label.toLowerCase()}`}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    column: {
        flex: 1,
        marginHorizontal: 5,
    },
    label: {
        marginBottom: 6,
        fontWeight: 'bold',
        fontSize: 14,
    },
});

export default FilterSelect;
