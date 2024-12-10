import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { getAuth } from "firebase/auth";
import { getDatabase, ref, onValue, offValue,push } from "firebase/database";
import AsyncStorage from '@react-native-async-storage/async-storage';
const HelpChat = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const auth = getAuth();
  const user = auth.currentUser;
  const db = getDatabase();
  const messageRef = ref(db, 'messages');
 const [id,setId]=useState('');

 useEffect(() => {
  const messageRef = ref(db, 'messages');

  const fetchData = async () => {
    try {
      const storedUserId = await AsyncStorage.getItem('userEmailSA');
      setId(storedUserId);

      onValue(messageRef, (snapshot) => {
        const data = snapshot.val();
        const bigObj = data;
        const messages = [];

        Object.keys(bigObj).map(key => {
          if (bigObj[key].sender === storedUserId || bigObj[key].receiver === storedUserId) {
            messages.push(bigObj[key]);
          }
        });

        // Descending order mein sort karein
        messages.sort((a, b) => b.timestamp - a.timestamp);

        setMessages(messages);
      });
    } catch (error) {
      console.error(error);
    }
  };
  fetchData();

  return () => {
    offValue(messageRef);
  };
}, []);

  const sendMessage = () => {
    push(messageRef, {
      text,
      sender: id,
      receiver: 'support',
      timestamp: Date.now(),
    });
    setText('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
          {/* <Icon name="arrow-back" size={24} color="white" /> */}
          <Text style={styles.accountText}>Help and Support</Text>
       
      </View>
      <ScrollView style={styles.chatContainer}>
        {messages.map((message, index) => (
          <View key={index} style={message.sender === id? styles.youMessage : styles.supportMessage}>
            <Text style={styles.messageText}>{message.text}</Text>
          </View>
        ))}
      </ScrollView>
      <View style={styles.sendMessageContainer}>
        <TextInput
          style={styles.sendMessageInput}
          value={text}
          onChangeText={(text) => setText(text)}
          placeholder="Type your message"
        />
        <TouchableOpacity onPress={sendMessage} style={styles.sendMessageButton}>
          <Icon name="send" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 10,
    backgroundColor: '#1c72b4', // Blue background color
    paddingVertical: 15,
    marginTop: 22,
  },
  leftSide: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  accountText: {
    color: 'white',
    fontSize: 18,
    textAlign: 'center',
    alignSelf: 'center',
    marginRight: 25, // Space between text and arrow
  },
  chatContainer: {
    flex: 1,
    padding: 10,
  },
  supportMessage: {
    backgroundColor: '#1c72b4',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
  },
  youMessage: {
    backgroundColor: '#3e8e41',
    padding: 10,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'flex-end',
  },
  messageText: {
    color: 'white',
    fontSize: 16,
  },
  sendMessageContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
  },
  sendMessageInput: {
    flex: 1,
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    backgroundColor: '#fff',
    borderRadius: 10,
  },
  sendMessageButton: {
    marginLeft: 10,
    backgroundColor: '#1c72b4',
    padding: 10,
    borderRadius: 10,
  },
});

export default HelpChat;