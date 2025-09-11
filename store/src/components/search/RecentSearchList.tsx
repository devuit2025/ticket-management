import React from 'react';
import Container from '@components/global/container/Container';
import Typography from '@components/global/typography/Typography';
import { useTranslation } from '@i18n/useTranslation';

import { RecentSearchCard } from './RecentSearchCard';
import { useTheme } from '@context/ThemeContext';

interface RecentSearch {
    from: string;
    to: string;
    day: string;
    dayBack?: string;
}

interface RecentSearchListProps {
    searches: RecentSearch[];
}

export const RecentSearchList: React.FC<RecentSearchListProps> = ({ searches }) => {
    const { translate } = useTranslation();
    const { theme } = useTheme();

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
                <RecentSearchCard key={idx} {...search} />
            ))}
        </Container>
    );
};
