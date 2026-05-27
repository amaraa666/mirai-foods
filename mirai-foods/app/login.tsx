import { useRouter } from "expo-router";
import { signInWithEmailAndPassword } from "firebase/auth";
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
import { firebaseAuth } from "@/lib/firebase";

const PRIMARY = "#3B0914";
const SUBTITLE = "#666";
const LABEL = "#333";
const INPUT_BG = "#F8F5F2";
const PLACEHOLDER = "#C4A07A";
const BG = "#FAF7F4";

const hero = require("../assets/images/start-hero.png");

export default function LoginScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [secureText, setSecureText] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleLogin = async () => {
    const cleanedEmail = email.trim();

    if (!cleanedEmail || !password.trim()) {
      Alert.alert("Missing details", "Please enter your email and password.");
      return;
    }

    try {
      setIsSubmitting(true);
      await signInWithEmailAndPassword(firebaseAuth, cleanedEmail, password);
      router.replace("/(tabs)");
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : "Sign in failed. Please try again.";
      Alert.alert("Login failed", message);
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
          <View style={{ height: insets.top + 320 }} />

          <View style={styles.card}>
            <Text style={styles.title}>Welcome Back</Text>
            <Text style={styles.subtitle}>
              Sign in to your artisanal journey.
            </Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>EMAIL</Text>
              <TextInput
                style={styles.input}
                placeholder="hello@example.com"
                placeholderTextColor={PLACEHOLDER}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.fieldGroup}>
              <View style={styles.labelRow}>
                <Text style={styles.label}>PASSWORD</Text>
                <Pressable>
                  <Text style={styles.forgotText}>Forgot Password?</Text>
                </Pressable>
              </View>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor={PLACEHOLDER}
                value={password}
                onChangeText={setPassword}
                secureTextEntry={secureText}
              />
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={handleLogin}
              disabled={isSubmitting}
            >
              <Text style={styles.buttonText}>
                {isSubmitting ? "Signing in..." : "Sign In"}
              </Text>
            </Pressable>

            <View style={styles.footerRow}>
              <Text style={styles.footerText}>Don't have an account? </Text>
              <Pressable onPress={() => router.push("/signup")}>
                <Text style={styles.footerLink}>Sign Up</Text>
              </Pressable>
            </View>
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
  card: {
    flex: 1,
    backgroundColor: BG,
    borderTopLeftRadius: 36,
    borderTopRightRadius: 36,
    paddingHorizontal: 28,
    paddingTop: 36,
    paddingBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: "700",
    color: "#1a1a1a",
    textAlign: "center",
    fontStyle: "italic",
  },
  subtitle: {
    marginTop: 10,
    fontSize: 15,
    color: SUBTITLE,
    textAlign: "center",
    marginBottom: 32,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 12,
    fontWeight: "600",
    color: LABEL,
    letterSpacing: 1,
    marginBottom: 8,
  },
  forgotText: {
    fontSize: 12,
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
  button: {
    marginTop: 16,
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
    marginTop: 20,
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
});
