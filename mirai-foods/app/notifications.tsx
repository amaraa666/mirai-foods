import { StyleSheet, View, TouchableOpacity } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Stack, useRouter } from 'expo-router';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';

export default function NotificationsScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();
  const router = useRouter();

  return (
    <>
      <Stack.Screen options={{ headerShown: false }} />
      <View style={[styles.container, { backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top }]}> 
        <View style={[styles.customHeader , {backgroundColor: Colors[colorScheme ?? 'light'].background,
}]}>
          <TouchableOpacity style={styles.customBack} onPress={() => router.back()}>
            <ThemedText style={styles.customBackText}>
              <FontAwesome5 name="arrow-left" size={20} color="black" />
            </ThemedText>
          </TouchableOpacity>
          <ThemedText type="title" style={styles.customTitle}>Notifications</ThemedText>
        </View>

        <ThemedText style={styles.text}>No new notifications yet.</ThemedText>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  customHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    marginBottom: 12,
  },
  customBack: {
    paddingVertical: 1,
  },
  customBackText: {
    fontWeight: 'bold',
  },
  customTitle: {
    flex: 1,
    textAlign: 'center',
    fontSize: 18,
    fontWeight: 'bold',
  },
  headerPlaceholder: {
    width: 60,
  },
  text: {
    marginTop: 12,
    fontSize: 16,
    color: '#888',
  },
});