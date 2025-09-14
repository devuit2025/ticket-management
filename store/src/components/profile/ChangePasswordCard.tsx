import React, { useState } from 'react';
import { View, StyleSheet, TextInput, Button } from 'react-native';
import Card from '@components/global/card/Card';
import Typography from '@components/global/typography/Typography';
import { useTranslation } from '@i18n/useTranslation';
import { changePassword } from '@api/auth';
import { showToast } from '@utils/toast';

export const ChangePasswordCard: React.FC = () => {
  const { translate } = useTranslation();

  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    if (!oldPassword || !newPassword || !confirmPassword) {
      showToast('error', translate('profile.passwordRequired'));
      return;
    }

    if (newPassword !== confirmPassword) {
      showToast('error', translate('profile.passwordMismatch'));
      return;
    }

    try {
      setLoading(true);
      const res = await changePassword({   old_password: oldPassword,
  new_password: newPassword, });
      showToast('success', res.message);
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
        console.log(err)
      showToast('error', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card style={{ marginBottom: 15 }}>
      <Typography variant="h2" weight="bold" style={styles.sectionTitle}>
        {translate('profile.changePassword')}
      </Typography>

      <View style={styles.block}>
        <Typography variant="body" weight="medium" style={styles.label}>
          {translate('profile.oldPassword')}
        </Typography>
        <TextInput
          value={oldPassword}
          onChangeText={setOldPassword}
          style={styles.input}
          placeholder={translate('profile.oldPassword')}
          secureTextEntry
        />
      </View>

      <View style={styles.block}>
        <Typography variant="body" weight="medium" style={styles.label}>
          {translate('profile.newPassword')}
        </Typography>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          style={styles.input}
          placeholder={translate('profile.newPassword')}
          secureTextEntry
        />
      </View>

      <View style={styles.block}>
        <Typography variant="body" weight="medium" style={styles.label}>
          {translate('profile.confirmPassword')}
        </Typography>
        <TextInput
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          style={styles.input}
          placeholder={translate('profile.confirmPassword')}
          secureTextEntry
        />
      </View>

      <Button title={translate('profile.save')} onPress={handleSave} disabled={loading} />
    </Card>
  );
};

const styles = StyleSheet.create({
  sectionTitle: { marginBottom: 12 },
  block: { marginBottom: 15 },
  label: { marginBottom: 4 },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
});
