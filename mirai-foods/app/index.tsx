import { Image } from "expo-image";
import { useRouter } from "expo-router";
import { BlurView } from "expo-blur";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PRIMARY = "#3B0914";
const SUBTITLE = "#757575";

const hero = require("../assets/images/start-hero.png");

export default function StartScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <View style={styles.root}>
      <Image
        source={hero}
        style={StyleSheet.absoluteFill}
        contentFit="cover"
        accessibilityIgnoresInvertColors
      />
      <View
        style={[
          styles.bottomArea,
          { paddingBottom: Math.max(insets.bottom, 20) },
        ]}
        pointerEvents="box-none"
      >
        <View style={styles.card}>
          <BlurView
            intensity={60}
            tint="light"
            style={StyleSheet.absoluteFill}
          />
          <View style={styles.cardContent}>
            <Text style={styles.title}>Mirai Foods</Text>
            <Text style={styles.subtitle}>Rescue fresh food.</Text>
            <Pressable
              style={({ pressed }) => [
                styles.button,
                pressed && styles.buttonPressed,
              ]}
              onPress={() => router.push("/login")}
            >
              <Text style={styles.buttonText}>GET STARTED</Text>
            </Pressable>
          </View>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#0a0a0a",
  },
  bottomArea: {
    flex: 1,
    justifyContent: "flex-end",
    paddingHorizontal: 16,
  },
  card: {
    width: "100%",
    borderRadius: 36,
    overflow: "hidden",
    backgroundColor: "rgba(200, 200, 200, 0.55)",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.15,
        shadowRadius: 16,
      },
      android: {
        elevation: 12,
      },
      default: {},
    }),
  },
  cardContent: {
    paddingHorizontal: 24,
    paddingTop: 32,
    paddingBottom: 32,
    alignItems: "center",
  },
  title: {
    fontSize: 30,
    fontWeight: "700",
    color: PRIMARY,
    textAlign: "center",
    letterSpacing: -0.3,
  },
  subtitle: {
    marginTop: 8,
    fontSize: 15,
    fontWeight: "400",
    color: SUBTITLE,
    textAlign: "center",
  },
  button: {
    width: "100%",
    marginTop: 24,
    backgroundColor: PRIMARY,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonPressed: {
    opacity: 0.9,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "700",
    letterSpacing: 1.2,
  },
});
