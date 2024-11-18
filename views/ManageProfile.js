import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
import { useNavigation, useRoute } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
const ManageProfile = () => {
    const navigation = useNavigation();
   
  return (
    <View style={styles.container}>
      
      {/* Profile Options */}
      <View style={styles.optionContainer}>
        <TouchableOpacity style={styles.option} onPress={() => navigation.navigate('Profile')}>
          <Icon name="person-outline" size={24} color="white" style={styles.icon} />
          <Text style={styles.optionText}>Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="key-outline" size={24} color="white" style={styles.icon} />
          <Text style={styles.optionText}>Credentials</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="stats-chart-outline" size={24} color="white" style={styles.icon} />
          <Text style={styles.optionText}>Active Sessions</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
          <Icon name="notifications-outline" size={24} color="white" style={styles.icon} />
          <Text style={styles.optionText}>Notifications</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.option}>
        <Icon name="trash-outline" size={24} color="red" style={styles.icon} />
        <Text style={styles.deleteText}>Delete Account</Text>
      </TouchableOpacity>
      </View>

      
      
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000', // Black background
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginLeft: 16,
  },
  optionContainer: {
    flex: 1,
    marginBottom: 24, // Adds some space between the options and Delete button
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
  },
  icon: {
    marginRight: 16,
  },
  optionText: {
    fontSize: 18,
    color: 'white',
  },
  deleteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
  },
  deleteText: {
    fontSize: 18,
    color: 'red',
    marginLeft: 8,
  },
});

export default ManageProfile;
