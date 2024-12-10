import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Image,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebaseCon";
import Feather from "@expo/vector-icons/Feather";
import Toast from "react-native-toast-message";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginScreen = () => {
  const navigation = useNavigation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

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
  }, [navigation]); // Added navigation to dependency array

  const handleLogin = async () => {
    // Basic input validation
    if (!email.trim() || !password.trim()) {
      Toast.show({
        type: "error",
        text1: "Please fill in both email and password.",
      });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; // More comprehensive email regex
    if (!emailRegex.test(email)) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid email address.",
      });
      return;
    }

    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email.trim(),
        password
      );
      const user = userCredential.user;

      // Store user ID
      await AsyncStorage.setItem("userIdSA", user.uid);
      await AsyncStorage.setItem("userEmailSA", email.trim());

      Toast.show({
        type: "success",
        text1: "Login successful!",
        visibilityTime: 2000,
      });

      // Navigate to Graph screen
      navigation.navigate("Graph"); // Using replace instead of navigate to prevent going back to login
    } catch (error) {
      let errorMessage = "An error occurred during login";

      switch (error.code) {
        case "auth/invalid-credential":
          errorMessage = "Invalid email or password";
          break;
        case "auth/user-disabled":
          errorMessage = "This account has been disabled";
          break;
        case "auth/network-request-failed":
          errorMessage = "Network error. Please check your connection";
          break;
        case "auth/too-many-requests":
          errorMessage = "Too many failed attempts. Please try again later";
          break;
      }

      Toast.show({
        type: "error",
        text1: errorMessage,
      });
      console.error("Login error:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={{
        flexDirection:'row',
        alignItems:'center',
        justifyContent:'center',
        marginBottom:60,
        // gap:20,
      }}>
        
      <Image source={{uri:'https://imgs.search.brave.com/_rLSardF2Tk6k3syUp7p2HvlnF5bDbgNRO53kevRg0g/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly93d3cu/bW9uZXlodWIuY28u/bnovdXBsb2Fkcy8x/LzEvMi8xLzExMjEw/MDE5OS9wdWJsaXNo/ZWQvYmxhY2tidWxs/LWxvZ28uanBnPzE3/MDEyNTQzMDE'}} style={{
        width:'100%',
        height:60,
      }}/>
      {/* <Text style={{
        color:'white',
        // textAlign:'center',
        fontSize:40,
        // fontFamily:'bold',
      }}>Black Bulls</Text> */}
      </View>
      <Text style={styles.title}>Login</Text>
      {/* <Text style={{
        textAlign:'center',
        color:'white',
        fontSize:22,
        marginVertical:10,
      }}>Welcome Back</Text> */}
      <View style={styles.input}>
        <Feather name="mail" color={"white"} size={20} />
        <TextInput
          style={{
            flex: 1,
            color: "white",
          }}
          placeholder="Email"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>
      <View style={styles.input}>
        <Feather name="lock" color={"white"} size={20} />
        <TextInput
          style={{
            flex: 1,
            color: "white",
          }}
          placeholder="Password"
          placeholderTextColor="rgba(255, 255, 255, 0.7)"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={true}
          autoCapitalize="none"
          autoCorrect={false}
          editable={!loading}
        />
      </View>

      {/* <TextInput
        style={styles.input}
       
      /> */}

      <TouchableOpacity
        style={[styles.button, loading && styles.buttonDisabled]}
        onPress={handleLogin}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Login</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity
        onPress={() => navigation.navigate("Signup")}
        disabled={loading}
      >
        <Text style={styles.signupText}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#000",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  title: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 30,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    color: "#fff",
    borderRadius: 10,
    paddingVertical: 15,
    paddingHorizontal: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#1E90FF",
  },
  button: {
    backgroundColor: "#1E90FF",
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonDisabled: {
    opacity: 0.7,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  signupText: {
    color: "#1E90FF",
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
});

export default LoginScreen;