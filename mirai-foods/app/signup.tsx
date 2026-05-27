import { useRouter } from "expo-router";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import {
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { firebaseAuth } from "@/lib/firebase";
import { createUserFirestoreStructure } from "@/services/firestoreStructure";

const PRIMARY = "#3B0914";
const SUBTITLE = "#666";
const LABEL = "#333";
const INPUT_BG = "#F8F5F2";
const PLACEHOLDER = "#C4A07A";
const BG = "#FAF7F4";

const hero = require("../assets/images/start-hero.png");

export default function SignupScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSignup = async () => {
    const cleanedName = fullName.trim();
    const cleanedEmail = email.trim();

    if (!cleanedName || !cleanedEmail || !password.trim()) {
      Alert.alert("Missing details", "Please fill your name, email, and password.");
      return;
    }

    try {
      setIsSubmitting(true);

      const result = await createUserWithEmailAndPassword(
        firebaseAuth,
        cleanedEmail,
        password
      );

      if (cleanedName) {
        await updateProfile(result.user, { displayName: cleanedName });
      }

      await createUserFirestoreStructure({
        uid: result.user.uid,
        email: result.user.email ?? cleanedEmail,
        fullName: cleanedName,
      });

      router.replace("/(tabs)");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Account creation failed. Please try again.";
      Alert.alert("Signup failed", message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <ImageBackground source={hero} style={styles.root} resizeMode="cover">
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        keyboardVerticalOffset={0}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
          bounces={false}
        >
          <Pressable
            onPress={() => router.back()}
            style={[
              styles.backBtn,
              { marginTop: insets.top + 8, marginLeft: 16 },
            ]}
          >
            <Feather name="arrow-left" size={22} color="#fff" />
          </Pressable>

          <View style={{ height: 150 }} />

          <View style={styles.card}>
            <Text style={styles.title}>Create Account</Text>
            <Text style={styles.subtitle}>
              Join Mirai Foods for an artisanal experience.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Full Name</Text>
              <TextInput
                style={styles.input}
                placeholder="Alexandre Savoury"
                placeholderTextColor={PLACEHOLDER}
                value={fullName}
                onChangeText={setFullName}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                placeholder="hello@miraifoods.com"
                placeholderTextColor={PLACEHOLDER}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Create Password</Text>
              <View style={styles.passwordWrapper}>
                <TextInput
                  style={[styles.input, styles.passwordInput]}
                  placeholder="••••••••"
                  placeholderTextColor={PLACEHOLDER}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureText}
                />
                <Pressable
                  style={styles.eyeBtn}
                  onPress={() => setSecureText(!secureText)}
                >
                  <Feather
                    name={secureText ? "eye" : "eye-off"}
                    size={20}
                    color="#999"
                  />
                </Pressable>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleSignup}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Creating..." : "Create Account"}
              </Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <Pressable onPress={() => router.push("/login")}>
                <Text style={styles.footerLink}>Sign In</Text>
              </Pressable>
            </View>

            <Text style={styles.termsText}>
              By signing up, you agree to our Terms of Service and Privacy
              Policy. Mirai Foods preserves your data with the highest culinary
              standards.
            </Text>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#1a1008",
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
  },
  backBtn: {
    width: 36,
    height: 36,
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    flex: 1,
    backgroundColor: BG,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 32,
    paddingBottom: 40,
  },
  title: {
    fontSize: 28,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: SUBTITLE,
    textAlign: "center",
    marginBottom: 28,
  },
  fieldGroup: {
    marginBottom: 18,
  },
  label: {
    fontSize: 13,
    fontWeight: "600",
    color: LABEL,
    marginBottom: 8,
  },
  input: {
    backgroundColor: INPUT_BG,
    borderRadius: 14,
    paddingHorizontal: 16,
    paddingVertical: 16,
    fontSize: 15,
    color: "#1a1a1a",
    borderWidth: 1,
    borderColor: "#EDE8E3",
  },
  passwordWrapper: {
    position: "relative",
  },
  passwordInput: {
    paddingRight: 50,
  },
  eyeBtn: {
    position: "absolute",
    right: 16,
    top: 0,
    bottom: 0,
    justifyContent: "center",
  },
  button: {
    marginTop: 12,
    backgroundColor: PRIMARY,
    paddingVertical: 18,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "700",
  },
  footerRow: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: 18,
  },
  footerText: {
    fontSize: 14,
    color: SUBTITLE,
  },
  footerLink: {
    fontSize: 14,
    fontWeight: "700",
    color: "#1a1a1a",
  },
  termsText: {
    marginTop: 28,
    fontSize: 12,
    color: "#999",
    textAlign: "center",
    lineHeight: 18,
  },
});
