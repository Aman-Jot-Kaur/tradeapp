import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import emailjs from "@emailjs/browser"; // EmailJS Import
import { auth, db, storage } from "../firebaseCon"; // Ensure Firebase is initialized
import Toast from "react-native-toast-message";
import * as DocumentPicker from "expo-document-picker"; // For file selection
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useNavigation } from "@react-navigation/native";

// Simulating OTP generation and validation
const generateOTP = () => Math.floor(100000 + Math.random() * 900000); // Random 6 digit OTP

const SignupScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState(""); // Store generated OTP
  const [documentFile, setDocumentFile] = useState(null); // Store the document object
  const [documentURL, setDocumentURL] = useState(""); // Store document URL after upload
  const navigation = useNavigation();

  const handleSendOTP = () => {
    if (!email) {
      Toast.show({
        type: "error",
        text1: "Please enter a valid email.",
      });
      return;
    }

    const otp = generateOTP(); // Generate OTP
    setGeneratedOtp(otp); // Store OTP locally

    // EmailJS template params
    const templateParams = {
      user_email: email,
      otp_code: otp, // Pass the generated OTP to the email template
    };

    // Send the OTP email using EmailJS
    emailjs
      .send(
        "service_tinn6xj", // Replace with your EmailJS Service ID
        "template_dqhhdt5", // Replace with your EmailJS Template ID
        templateParams,
        "OcTpocYuldS4L7Y0b" // Replace with your EmailJS Public Key
      )
      .then(() => {
        console.log("OTP sent successfully to:", email);
        Toast.show({
          type: "success",
          text1: `OTP sent to ${email}`,
        });
      })
      .catch((error) => {
        console.error("Error sending email:", error);
        Toast.show({
          type: "error",
          text1: "Failed to send OTP.",
        });
      });
  };

  const handleVerifyOTP = () => {
    console.log(otp,generatedOtp);
    if (otp == generatedOtp) {
      Toast.show({
        type: "success",
        text1: "OTP Verified Successfully!",
      });
    } else {
      Toast.show({
        type: "error",
        text1: "Invalid OTP.",
      });
    }
  };

  const handleDocumentUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync();
      console.log("DocumentPicker result:", result);
  
      if (!result.canceled) {
        const file = result.assets ? result.assets[0] : result.output[0]; // Extract the file
        const fileName = file.name;
        const fileUri = file.uri;
  
        setDocumentFile(file); // Store the document for display
        console.log("Uploading file:", fileName);
  
        const fileRef = ref(storage, `documents/${fileName}`);
        let blob;
  
        // Web handles `data:` URIs differently; ensure the blob is created properly
        if (fileUri.startsWith("data:")) {
          blob = await (await fetch(fileUri)).blob();
        } else {
          const response = await fetch(fileUri);
          blob = await response.blob();
        }
  
        // Upload file to Firebase Storage
        await uploadBytes(fileRef, blob);
        const downloadURL = await getDownloadURL(fileRef);
  
        console.log("File uploaded successfully. URL:", downloadURL);
        setDocumentURL(downloadURL); // Save download URL for later use
        Toast.show({ type: "success", text1: "Document Uploaded!" });
      } else {
        console.log("Document selection was canceled.");
      }
    } catch (error) {
      console.error("Error uploading document:", error);
      Toast.show({ type: "error", text1: "Failed to upload document." });
    }
  };
  

  const handleSignup = async () => {
    if (!email || !password) {
      console.log(email,password,documentURL)
      Toast.show({ type: "error", text1: "Please fill in all fields." });
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await setDoc(doc(db, "users", userCredential.user.uid), {
        email: email,
        document: documentURL,
        status: "inactive",
      });

      Toast.show({ type: "success", text1: "Signup Successful!" });
      navigation.navigate("Login");
    } catch (error) {
      console.error("Error signing up:", error);
      Toast.show({ type: "error", text1: "Signup Failed!" });
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="Email"
        placeholderTextColor="gray"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
      />

      {/* Send OTP Button */}
      <TouchableOpacity style={styles.button} onPress={handleSendOTP}>
        <Text style={styles.buttonText}>Send OTP</Text>
      </TouchableOpacity>

      {/* OTP Input */}
      <TextInput
        style={styles.input}
        placeholder="Enter OTP"
        placeholderTextColor="rgba(255, 255, 255, 0.7)"
        value={otp}
        onChangeText={setOtp}
        keyboardType="numeric" // Ensures English numbers are used
        maxLength={6} // Limiting to 6 digits if required
      />
      <TouchableOpacity style={styles.button} onPress={handleVerifyOTP}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Password Input */}
      <TextInput
        style={styles.input}
        placeholder="Password"
        placeholderTextColor="gray"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      {/* Document Upload */}
      <TouchableOpacity style={styles.button} onPress={handleDocumentUpload}>
        <Text style={styles.buttonText}>
          {documentFile ? `Document Selected: ${documentFile.name}` : "Upload Aadhar/PAN Card"}
        </Text>
      </TouchableOpacity>

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </TouchableOpacity>

      {/* Login Navigation */}
      <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('Login')}>
        <Text style={styles.buttonText}>Login instead?</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20, backgroundColor: "#000" },
  title: { color: "white", fontSize: 24, textAlign: "center", marginBottom: 20 },
  input: {
    backgroundColor: "rgba(255,255,255,0.1)",
    color: "white",
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  button: {
    backgroundColor: "#1E90FF",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 20,
  },
  buttonText: { color: "white", fontWeight: "bold" },
});

export default SignupScreen;
