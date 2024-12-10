import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import {
  collection,
  query,
  where,
  getDocs,
  updateDoc,
  arrayUnion,
} from "firebase/firestore";
import { db, auth } from "../firebaseCon";
import Toast from "react-native-toast-message";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import AntDesign from "@expo/vector-icons/AntDesign";
import Entypo from "@expo/vector-icons/Entypo";
const SignupScreen = ({ navigation }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [invitedby, setInvitedBy] = useState("");
  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  // Check if user is already logged in
  useEffect(() => {
    const checkLoginStatus = async () => {
      try {
        const userId = await AsyncStorage.getItem("userIdSA");
        const userEmailSA = await AsyncStorage.getItem("userEmailSA");

        if (userId && userEmailSA) {
          navigation.navigate("Graph");
        }
      } catch (error) {
        console.error("Error checking login status:", error);
      }
    };

    checkLoginStatus(); // Call the async function

    // Optional cleanup function
    return () => {
      // Any cleanup code if needed
    };
  }, [navigation]);
  const handleSignup = async () => {
    // Basic input validation
    if (!name || !email || !password || !confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Please fill in all fields.",
      });
      return;
    }

    if (password !== confirmPassword) {
      Toast.show({
        type: "error",
        text1: "Passwords do not match!",
      });
      return;
    }

    const emailRegex = /\S+@\S+\.\S+/; // Basic regex for email validation
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid email address.",
      });
      return;
    }

    try {
      // Create user with email and password
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      // Store user data in Firestore
      await setDoc(doc(db, "users", user.uid), {
        name: name,
        email: email,
        subadmin:["superadmin31@gmail.com"]
      });

      // Find user by invitedBy emailif
      if(invitedby!==""){
      const q = query(collection(db, "users"), where("email", "==", invitedby));
      const querySnapshot = await getDocs(q);

      if (querySnapshot.docs.length > 0) {
        const invitedByDoc = querySnapshot.docs[0].ref;
        await updateDoc(invitedByDoc, {
          invitedTraders: arrayUnion(email),
        });
        console.log("User added to invitedTraders");
      } else {
        console.error("User not found!");
      }
    }
      // Clear the form after successful signup
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      console.log("User signed up and data stored:", user.uid);
      navigation.navigate("Login"); // Adjust as needed
    } catch (error) {
      if (error.code === "auth/email-already-in-use") {
        Toast.show({
          type: "error",
          text1: "This email is already in use.",
        });
      } else if (error.code === "auth/invalid-email") {
        Toast.show({
          type: "error",
          text1: "The email address is not valid.",
        });
      } else if (error.code === "auth/weak-password") {
        Toast.show({
          type: "error",
          text1: "The password is too weak.",
        });
      } else {
        Toast.show({
          type: "error",
          text1: error.message,
        });
      }
      console.error("Error signing up:", error);
    }
  };

  return (
    <View style={styles.container}>
      <View
        style={{
          flexDirection: "row",
          justifyContent: "center",
        }}
      >
        <Entypo name="add-user" size={34} color="white" />
        <Text style={styles.title}>Sign Up</Text>
      </View>

      <View style={styles.inputContainer}>
        <FontAwesome name="user" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Full Name"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={name}
          onChangeText={setName}
        />
      </View>
      {/* Name Input */}

      {/* Email Input */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail" size={32} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="wifi-password" size={24} color="white" />
        {/* Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <MaterialIcons name="wifi-password" size={24} color="white" />
        {/* Confirm Password Input */}
        <TextInput
          style={styles.input}
          placeholder="Confirm Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>
      <View style={styles.inputContainer}>
        <AntDesign name="addfolder" size={24} color="white" />
        <TextInput
          style={styles.input}
          placeholder="Enter invite code"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={invitedby}
          onChangeText={setInvitedBy}
          autoCapitalize="none"
          autoCorrect={false}
        />
      </View>

      {/*setInvitedBy}

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Optional: Navigate to Login Page */}
      <TouchableOpacity onPress={() => navigation.navigate("Login")}>
        <Text style={styles.loginText}>Already have an account? Login</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000", // Black background
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 40,
    marginLeft: 10,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 20,
    // width: "90%",
    borderWidth: 1,
    marginHorizontal: 10,
    borderColor: "#1E90FF",
  },
  input: {
    // backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    marginLeft: 20,
    // borderRadius: 10,
    // paddingVertical: 15,
    // paddingHorizontal: 20,
    // marginBottom: 20,
    // borderWidth: 1,
    // borderColor: "#1E90FF", // Blue border
  },
  button: {
    backgroundColor: "#1E90FF", // Blue button
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  loginText: {
    color: "#1E90FF", // Blue text for login link
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default SignupScreen;
