import { StyleSheet, View, TouchableOpacity, ScrollView } from 'react-native';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Colors } from '@/constants/theme';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function ProfileScreen() {
  const colorScheme = useColorScheme();
  const insets = useSafeAreaInsets();

  return (
    <View style={{ flex: 1, backgroundColor: Colors[colorScheme ?? 'light'].background, paddingTop: insets.top }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 30 }} showsVerticalScrollIndicator={false}>
        <ThemedText type="title">Profile</ThemedText>
        <View style={styles.card}>
          <ThemedText style={styles.label}>Name:</ThemedText>
          <ThemedText style={styles.value}>Tania William</ThemedText>
        </View>
        <View style={styles.card}>
          <ThemedText style={styles.label}>Email:</ThemedText>
          <ThemedText style={styles.value}>tania@example.com</ThemedText>
        </View>
        <TouchableOpacity style={[styles.button, { backgroundColor: Colors[colorScheme ?? 'light'].tint }]}>
          <ThemedText style={styles.buttonText}>Edit Profile</ThemedText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  card: { marginTop: 20, padding: 16, borderRadius: 12, backgroundColor: '#fff' },
  label: { fontSize: 14, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold', marginTop: 4 },
  button: { marginTop: 24, padding: 14, borderRadius: 12, alignItems: 'center' },
  buttonText: { color: '#fff', fontWeight: 'bold' },
});