import Icon from '@components/global/icon/Icon';
import ScreenWrapper from '@components/global/screen/ScreenWrapper';
import React from 'react';
import { Text } from 'react-native';

const HomeScreen = () => {
    return (
        <ScreenWrapper>
            <Text>HomeScreen content</Text>
            <Icon name="home-outline" type="ion" size="lg" />
        </ScreenWrapper>
    );
};

export default HomeScreen;
