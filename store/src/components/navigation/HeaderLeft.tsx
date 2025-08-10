import React from 'react';
import { NavigationProp } from '@react-navigation/native';
import BackButton from './BackButton';
import CompanyLogo from '@components/global/logo/CompanyLogo';

interface HeaderLeftProps {
    navigation: NavigationProp<Record<string, object | undefined>>;
    routeName: string;
}

const HeaderLeft: React.FC<HeaderLeftProps> = ({ navigation, routeName }) => {
    return routeName === 'Home' ? <CompanyLogo /> : <BackButton navigation={navigation} />;
};

export default HeaderLeft;
