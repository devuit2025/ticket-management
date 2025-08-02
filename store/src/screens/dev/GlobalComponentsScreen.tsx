import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput as RNTextInput } from 'react-native';

// Import your global components
import Button from '@components/global/button/Button';
import TextInput from '@components/global/textinput/TextInput';
import Typography from '@components/global/typography/Typography';
import Icon from '@components/global/icon/Icon';
import Card from '@components/global/card/Card';
import Modal from '@components/global/modal/Modal';
import Loader from '@components/global/loader/Loader';
import Divider from '@components/global/divider/Divider';
import Avatar from '@components/global/avatar/Avatar';
import Snackbar from '@components/global/snackbar/Snackbar';
import Switch from '@components/global/switch/Switch';
import Checkbox from '@components/global/checkbox/Checkbox';
import RadioButton from '@components/global/radiobutton/RadioButton';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '@navigation/navigationTypes';

type GlobalComponentsScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'GlobalComponents'>;

const GlobalComponentsScreen = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [switchValue, setSwitchValue] = useState(false);
  const [checkboxValue, setCheckboxValue] = useState(false);
  const [radioValue, setRadioValue] = useState(false);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Global Components Showcase</Text>

      <View style={styles.section}>
        <Text style={styles.heading}>Button</Text>
        <Button />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>TextInput</Text>
        <TextInput placeholder="Sample input" />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Typography</Text>
        <Typography>Sample typography text</Typography>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Icon</Text>
        <Icon name="star" size={30} color="orange" />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Card</Text>
        <Card>
          <Text>Card content</Text>
        </Card>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Modal</Text>
        {/* Trigger modal */}
        <Button title="Open Modal" onPress={() => setModalVisible(true)} />
        <Modal visible={modalVisible} onClose={() => setModalVisible(false)}>
          <Text>This is a modal content</Text>
          <Button title="Close Modal" onPress={() => setModalVisible(false)} />
        </Modal>
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Loader</Text>
        <Loader />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Divider</Text>
        <Divider />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Avatar</Text>
        <Avatar uri="https://placekitten.com/100/100" />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Snackbar</Text>
        <Snackbar message="This is a snackbar message" />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Switch</Text>
        <Switch value={switchValue} onValueChange={setSwitchValue} />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>Checkbox</Text>
        <Checkbox value={checkboxValue} onValueChange={setCheckboxValue} />
      </View>

      <View style={styles.section}>
        <Text style={styles.heading}>RadioButton</Text>
        <RadioButton selected={radioValue} onPress={() => setRadioValue(!radioValue)} />
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    marginBottom: 24,
  },
  heading: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default GlobalComponentsScreen;
