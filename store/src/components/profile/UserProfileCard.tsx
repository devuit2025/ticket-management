import React from 'react';
import { StyleSheet } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { InfoRow } from '@components/global/typography/InfoRow';
import { useTranslation } from '@i18n/useTranslation';

interface UserProfile {
  id: number;
  name: string;
  phone: string;
  role: string;
  status: number;
  createdAt: string;
  updatedAt: string;
}

interface UserProfileCardProps {
  user: UserProfile;
}

export const UserProfileCard: React.FC<UserProfileCardProps> = ({ user }) => {
  const { translate } = useTranslation();

  return (
    <Card style={{ marginBottom: 15 }}>
      <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
        {translate('profile.title')}
      </Typography>

      <InfoRow label={translate('profile.name')} value={user.name} />
      <InfoRow label={translate('profile.phone')} value={user.phone} />
      <InfoRow label={translate('profile.role')} value={user.role} />
      <InfoRow
        label={translate('profile.status')}
        value={user.status === 2 ? translate('profile.verified') : translate('profile.created')}
      />
      <InfoRow label={translate('profile.createdAt')} value={new Date(user.createdAt).toLocaleString()} />
      <InfoRow label={translate('profile.updatedAt')} value={new Date(user.updatedAt).toLocaleString()} />
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { marginBottom: 12 },
});
