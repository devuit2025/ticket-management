import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import HorizontalDateSelector from '@components/date/HorizontalDateSelector';
import FilterSelect from '@components/global/select/FilterSelect';

interface FilterOption {
    label: string;
    value: string;
}

interface FilterConfig {
    label: string;
    options: FilterOption[];
}

interface FilterCardProps {
    selectedDate: string;
    onDateChange: (date: string) => void;
    filters?: FilterConfig[]; // dynamic filters
    onFiltersChange: (selected: Record<string, string | undefined>) => void;
}

const FilterCard: React.FC<FilterCardProps> = ({
    selectedDate,
    onDateChange,
    filters,
    onFiltersChange,
}) => {
    // const [selectedFilters, setSelectedFilters] = useState<Record<string, string | undefined>>(
    //     filters.reduce((acc, f) => ({ ...acc, [f.label]: undefined }), {})
    // );

    // const handleFilterChange = (label: string, value: string) => {
    //     const updated = { ...selectedFilters, [label]: value };
    //     setSelectedFilters(updated);
    //     onFiltersChange(updated);
    // };

    return (
        <Card style={{ marginBottom: 15 }}>
            <HorizontalDateSelector value={selectedDate} onChange={onDateChange} />
            {/* <View style={styles.container}>
                {filters.map((f) => (
                    <FilterSelect
                        key={f.label}
                        label={f.label}
                        options={f.options}
                        value={selectedFilters[f.label]}
                        onChange={(val) => handleFilterChange(f.label, val)}
                    />
                ))}
            </View> */}
        </Card>
    );
};

const styles = StyleSheet.create({
    container: {
        flexDirection: 'row',
        marginTop: 15,
    },
});

export default FilterCard;
