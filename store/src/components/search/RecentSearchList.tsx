import React from 'react';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import { useTranslation } from '@i18n/useTranslation';

import { RecentSearchCard } from './RecentSearchCard';
import { useTheme } from '@context/ThemeContext';
import { StyleSheet, TouchableOpacity } from 'react-native';

interface RecentSearch {
    from: string;
    to: string;
    day: string;
    dayBack?: string;
}

interface RecentSearchListProps {
    searches: RecentSearch[];
    onSearchClick?: (search: any) => void;
}

export const RecentSearchList: React.FC<RecentSearchListProps> = ({ searches, onSearchClick }) => {
    const { translate } = useTranslation();
    const { theme } = useTheme();

    if (!searches || searches.length === 0) return null;

    return (
        <Container>
            <Typography
                variant="h2"
                weight="bold"
                color={theme.colors.onPrimary}
                style={{ marginBottom: 10 }}
            >
                {translate('booking.recentSearch')}
            </Typography>

            {searches.map((search, idx) => (
                <TouchableOpacity
                    key={idx}
                    style={styles.item}
                    onPress={() => onSearchClick?.(search)}
                >
                    <RecentSearchCard key={idx} {...search} />
                </TouchableOpacity>
            ))}
        </Container>
    );
};

const styles = StyleSheet.create({
    item: {
        borderBottomWidth: 1,
        borderColor: '#ccc',
    },
});
