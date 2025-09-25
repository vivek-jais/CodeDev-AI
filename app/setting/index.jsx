// screens/SettingsScreen.js
import React from 'react';
import { View, Text, Switch, StyleSheet } from 'react-native';
import Colors from '../../constant/Colors';

const SettingsScreen = () => {
  const [isDarkMode, setIsDarkMode] = React.useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Settings</Text>
      <View style={styles.settingItem}>
        <Text style={styles.label}>Dark Mode</Text>
        <Switch
          value={isDarkMode}
          onValueChange={setIsDarkMode}
          trackColor={{ false: Colors.GRAY, true: Colors.PRIMARY }}
          thumbColor={isDarkMode ? Colors.WHITE : Colors.PRIMARY}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.WHITE,
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.PRIMARY,
    marginBottom: 20,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomColor: Colors.GRAY,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 18,
    color: Colors.PRIMARY,
  },
});

export default SettingsScreen;
