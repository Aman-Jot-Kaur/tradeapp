 import React, { useState, useEffect , useCallback} from 'react';
 import { View, Text, TextInput, Switch, ScrollView, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
 import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
 import { db } from '../firebaseCon';
 import Toast from 'react-native-toast-message';
 import { useFocusEffect} from '@react-navigation/native';

 const Profile = () => {
  const [visibility, setVisibility] = useState({
    isPublic: false,
    contactInfoVisible: false,
    tradingStatsVisible: true,
    aboutVisible: true,
    brokerVisible: true,
    copyStrategiesVisible: true,
    favCopyStrategiesVisible: true,
    publicAlgorithmsVisible: false,
  });

  const [contactInfo, setContactInfo] = useState({
    phone: '',
    whatsapp: '',
    telegram: '',
    facebook: '',
    instagram: '',
    xPlatform: '',
    youtube: '',
    about: '',
    name:''
  });

  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      const getUserIdAndFetchData = async () => {
        try {
          const storedUserId = await AsyncStorage.getItem('userIdSA');
          if (storedUserId) {
            setUserId(storedUserId);
            await fetchUserData(storedUserId);
          } else {
            Toast.show({
              type: 'error',
              text1: 'User ID not found',
            });
            setLoading(false);
          }
        } catch (error) {
          console.error('Error fetching userId:', error);
          Toast.show({
            type: 'error',
            text1: 'Error loading user ID',
          });
          setLoading(false);
        }
      };

      getUserIdAndFetchData(); // Call the async function

     
    }, [])
  );

  const fetchUserData = async (uid) => {
    try {
      const userDoc = await getDoc(doc(db, 'users', uid));
      if (userDoc.exists()) {
        const userData = userDoc.data();
        setVisibility({
          isPublic: userData.isPublic ?? false,
          contactInfoVisible: userData.contactInfoVisible ?? false,
          tradingStatsVisible: userData.tradingStatsVisible ?? true,
          aboutVisible: userData.aboutVisible ?? true,
          brokerVisible: userData.brokerVisible ?? true,
          copyStrategiesVisible: userData.copyStrategiesVisible ?? true,
          favCopyStrategiesVisible: userData.favCopyStrategiesVisible ?? true,
          publicAlgorithmsVisible: userData.publicAlgorithmsVisible ?? false,
        });
        setContactInfo({
          phone: userData.phone ?? '',
          whatsapp: userData.whatsapp ?? '',
          telegram: userData.telegram ?? '',
          facebook: userData.facebook ?? '',
          instagram: userData.instagram ?? '',
          xPlatform: userData.xPlatform ?? '',
          youtube: userData.youtube ?? '',
          about: userData.about ?? '',
          name: userData.name ?? ''
        });
      } else {
        await createNewUserProfile(uid);
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      Toast.show({
        type: 'error',
        text1: 'Error loading profile',
        text2: 'Please try again later',
      });
    } finally {
      setLoading(false);
    }
  };

  const createNewUserProfile = async (uid) => {
    try {
      const defaultData = {
        isPublic: false,
        contactInfoVisible: false,
        tradingStatsVisible: true,
        aboutVisible: true,
        brokerVisible: true,
        copyStrategiesVisible: true,
        favCopyStrategiesVisible: true,
        publicAlgorithmsVisible: false,
        phone: '',
        whatsapp: '',
        telegram: '',
        facebook: '',
        instagram: '',
        xPlatform: '',
        youtube: '',
        about: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      };
      await setDoc(doc(db, 'users', uid), defaultData);
      setVisibility(defaultData);
      setContactInfo({
        phone: '',
        whatsapp: '',
        telegram: '',
        facebook: '',
        instagram: '',
        xPlatform: '',
        youtube: '',
        about: '',
      });
    } catch (error) {
      console.error('Error creating new user profile:', error);
    }
  };

  // Function to update Firebase whenever user modifies profile
  const updateUserDataInFirebase = async (field, value) => {
    if (!userId) return;

    try {
      await updateDoc(doc(db, 'users', userId), {
        [field]: value,
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      console.error(`Error updating ${field}:`, error);
      Toast.show({
        type: 'error',
        text1: `Error updating ${field}`,
      });
    }
  };

  const handleVisibilityToggle = (key) => {
    const updatedVisibility = { ...visibility, [key]: !visibility[key] };
    setVisibility(updatedVisibility);
    updateUserDataInFirebase(key, updatedVisibility[key]); // Update Firebase
  };

  const handleContactInfoChange = (key, value) => {
    const updatedContactInfo = { ...contactInfo, [key]: value };
    setContactInfo(updatedContactInfo);
    updateUserDataInFirebase(key, value); // Update Firebase
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#3c42ca" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>

      {/* Profile Image Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity style={styles.profileImageContainer}>
          <View style={styles.profileImage}>
            <Text style={styles.initials}>{contactInfo.name}</Text>
          </View>
        </TouchableOpacity>
      </View>

      {/* Make Profile Public Toggle */}
      <View style={styles.row}>
        <Text style={styles.label}>Make your profile public</Text>
        <Switch
          value={visibility.isPublic}
          onValueChange={() => handleVisibilityToggle('isPublic')}
          thumbColor={visibility.isPublic ? '#3c42ca' : '#f4f3f4'}
          trackColor={{ false: '#767577', true: '#81b0ff' }}
        />
      </View>

      {/* Contact Information Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Contact Information</Text>
        {Object.keys(contactInfo).map((key) => (
          <TextInput
            key={key}
            style={styles.input}
            placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
            placeholderTextColor="#ccc"
            value={contactInfo[key]}
            onChangeText={(value) => handleContactInfoChange(key, value)}
          />
        ))}
      </View>

      {/* Visibility Toggles */}
      <Text style={styles.visibilityHeader}>
        Choose what information about yourself you want to show to other users
      </Text>

      {[
        { label: 'Contact Information', key: 'contactInfoVisible' },
        { label: 'Trading Stats', key: 'tradingStatsVisible' },
        { label: 'About', key: 'aboutVisible' },
        { label: 'Recommended Broker', key: 'brokerVisible' },
        { label: 'Copy Strategies', key: 'copyStrategiesVisible' },
        { label: 'Favourite Copy Strategies', key: 'favCopyStrategiesVisible' },
        { label: 'Public Algorithms', key: 'publicAlgorithmsVisible' },
      ].map(({ label, key }) => (
        <View key={key} style={styles.section}>
          <View style={styles.row}>
            <Text style={styles.sectionTitle}>{label}</Text>
            <Switch
              value={visibility[key]}
              onValueChange={() => handleVisibilityToggle(key)}
              thumbColor={visibility[key] ? '#3c42ca' : '#f4f3f4'}
              trackColor={{ false: '#767577', true: '#81b0ff' }}
            />
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000', // Black background
    paddingHorizontal: 20,
    paddingVertical: 30,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 30,
  },
  profileImageContainer: {
    borderRadius: 30,
    width:300,
    height: 100,
    justifyContent: 'center',
    alignItems: 'center',
  },
  profileImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    justifyContent: 'center',
    alignItems: 'center',
  },
  initials: {
    fontSize: 32,
    color: '#fff',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  label: {

        color: '#fff',
        fontSize: 16,
        maxWidth: '70%', // Adjust this value as needed   
  },
  input: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 5,
    color: '#fff',
    marginBottom: 15,
    backgroundColor: '#333',
   padding:5
    
  },
  inputMultiline: {
    borderColor: '#ccc',
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 10,
    borderRadius: 5,
    color: '#fff',
    backgroundColor: '#333',
    textAlignVertical: 'top',
    marginTop:10
  },
  section: {
    
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    maxWidth: '70%',
    fontWeight: '400',
    
  },
});

export default Profile;


// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: '#000',
//     paddingHorizontal: 20,
//     paddingVertical: 30,
//   },
//   profileSection: {
//     alignItems: 'center',
//     marginBottom: 30,
//   },
//   profileImageContainer: {
//     borderRadius: 50,
//     width: 100,
//     height: 100,
//     backgroundColor: '#ff007f',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   profileImage: {
//     width: 90,
//     height: 90,
//     borderRadius: 45,
//     backgroundColor: '#ff007f',
//     justifyContent: 'center',
//     alignItems: 'center',
//   },
//   initials: {
//     fontSize: 32,
//     color: '#fff',
//   },
//   centerContent: {
//     justifyContent: 'center',
//     alignItems: 'center',
//     flex: 1,
//   },
// });

