import React, { useEffect, useState } from 'react';
import { ScrollView, ActivityIndicator } from 'react-native';
import { UserProfileCard } from '@components/profile/UserProfileCard';
import { ChangePasswordCard } from '@components/profile/ChangePasswordCard';
import { getProfile, User } from '@api/users';
import { showToast } from '@utils/toast';

const ProfileScreen = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Fetch user profile on mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await getProfile();
        console.log(data)
        setUser(data);
      } catch (err: any) {
        console.error(err);
        showToast('error', 'Failed to fetch profile');
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) {
    return <ActivityIndicator style={{ flex: 1, marginTop: 50 }} size="large" />;
  }

  if (!user) {
    return null;
  }

  return (
    <ScrollView style={{ padding: 16 }}>
      <UserProfileCard user={user} />
      <ChangePasswordCard
        user={user}
        onUpdate={(updatedUser) => setUser(updatedUser)} // update user after password change
      />
    </ScrollView>
  );
};

export default ProfileScreen;
