import Feather from "@expo/vector-icons/Feather";
import { NotificationBell } from "@/components/NotificationBell";
import { Image } from "expo-image";
import { useRouter } from "expo-router";
import React from "react";
import {
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const router = useRouter();
  const [badgeModalOpen, setBadgeModalOpen] = React.useState(false);
  const [earnedBadgeIds, setEarnedBadgeIds] = React.useState<string[]>([
    "b1",
    "b2",
    "b3",
    "b4",
  ]);

  const toggleEarned = (badgeId: string) => {
    setEarnedBadgeIds((prev) => {
      if (prev.includes(badgeId)) return prev.filter((id) => id !== badgeId);
      return [...prev, badgeId];
    });
  };
  return (
    <View style={[styles.root, { paddingTop: insets.top }]}>
      <ScrollView
        contentContainerStyle={{
          paddingHorizontal: 20,
          paddingBottom: 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.headerBrand}>Savor</Text>
          <NotificationBell color={COLORS.text} size={18} />
        </View>

        {/* Title */}
        <Text style={styles.bigTitle}>Positive{"\n"}Change.</Text>

        {/* Score pill */}
        <View style={styles.scorePill}>
          <Text style={styles.scoreValue}>124.8</Text>
          <Text style={styles.scoreSub}>YOU'RE 2ND NOW? 10 POINTS SAVED</Text>
        </View>

        {/* Monthly Goal card */}
        <View style={styles.monthCard}>
          <Text style={styles.monthTitle}>Monthly Goal</Text>
          <Text style={styles.monthDesc}>
            You&apos;re 125% towards your carbon reduction target
          </Text>

          <View style={styles.donutRow}>
            <Donut percent={82} />
          </View>

          <View style={styles.donutLegend}>
            <View style={styles.legendItem}>
              <Text style={styles.legendLabel}>CURRENT RATED</Text>
              <Text style={styles.legendValue}>82%</Text>
            </View>
            <View style={styles.legendItem}>
              <Text style={styles.legendLabel}>RANKED</Text>
              <Text style={styles.legendValue}>172/500</Text>
            </View>
          </View>
        </View>

        {/* Two eco stats */}
        <View style={styles.twoStats}>
          <StatItem
            icon="droplet"
            label="1,420L"
            sub="WATER SAVED"
          />
          <StatItem
            icon="leaf"
            label="5.2"
            sub="CO2e REDUCED"
          />
        </View>

        {/* Share impact card */}
        <View style={styles.shareCard}>
          <Text style={styles.shareTitle}>
            You&apos;re in the top 3% of local diners
            <Text style={styles.shareTitleAccent}> prioritizing eco impact.</Text>
          </Text>
          <Pressable style={styles.shareBtn} onPress={() => {}}>
            <Feather name="share-2" size={16} color={COLORS.accent} />
            <Text style={styles.shareBtnText}>Share Impact</Text>
          </Pressable>
        </View>

        {/* Badge gallery */}
        <View style={styles.badgeCard}>
          <View style={styles.badgeHeader}>
            <Text style={styles.badgeHeaderTitle}>Badge Gallery</Text>
            <Pressable onPress={() => setBadgeModalOpen(true)} hitSlop={10}>
              <Text style={styles.badgeHeaderAction}>View All</Text>
            </Pressable>
          </View>

          <View style={styles.badgeGrid}>
            {badges.map((b) => (
              <View key={b.id} style={styles.badgeItem}>
                {(() => {
                  const earned = earnedBadgeIds.includes(b.id);
                  return (
                    <>
                      <View
                        style={[
                          styles.badgeCircle,
                          { backgroundColor: earned ? b.bg : "#F0F0F0" },
                        ]}
                      >
                        <Feather
                          name={b.icon as any}
                          size={24}
                          color={earned ? COLORS.accent : "#BDBDBD"}
                        />
                      </View>
                      <Text
                        style={[
                          styles.badgeName,
                          !earned && styles.badgeNameLocked,
                        ]}
                      >
                        {b.title}
                      </Text>
                    </>
                  );
                })()}
              </View>
            ))}
          </View>
        </View>

        {/* Bottom banner image */}
        <View style={styles.bottomImageCard}>
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1521302080379-0f64f3b3c2db?w=900&q=80",
            }}
            style={styles.bottomImage}
            contentFit="cover"
          />
          <View style={styles.bottomImageOverlay}>
            <Text style={styles.bottomImageTitle}>Every choice counts</Text>
            <Text style={styles.bottomImageSub}>
              Turn daily habits into measurable sustainability.
            </Text>
          </View>
        </View>
      </ScrollView>

      <Modal
        visible={badgeModalOpen}
        animationType="slide"
        transparent
        onRequestClose={() => setBadgeModalOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setBadgeModalOpen(false)}
          />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Badge Gallery</Text>
              <Pressable
                style={styles.modalCloseBtn}
                onPress={() => setBadgeModalOpen(false)}
                hitSlop={10}
              >
                <Feather name="x" size={18} color={COLORS.accent} />
              </Pressable>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 20 }}
            >
              {badges.map((b, idx) => {
                const earned = earnedBadgeIds.includes(b.id);
                return (
                  <Pressable
                    key={b.id}
                    onPress={() => toggleEarned(b.id)}
                    style={[
                      styles.modalRow,
                      idx !== badges.length - 1 && styles.modalRowBorder,
                    ]}
                  >
                    <View
                      style={[
                        styles.modalCircle,
                        { backgroundColor: earned ? b.bg : "#F0F0F0" },
                      ]}
                    >
                      <Feather
                        name={b.icon as any}
                        size={22}
                        color={earned ? COLORS.accent : "#BDBDBD"}
                      />
                    </View>
                    <Text
                      style={[
                        styles.modalRowTitle,
                        !earned && styles.badgeNameLocked,
                      ]}
                    >
                      {b.title}
                    </Text>
                  </Pressable>
                );
              })}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const COLORS = {
  bg: "#FCF7F4",
  card: "#FFFFFF",
  accent: "#4A151B",
  accentDark: "#2E0A11",
  text: "#2D2926",
  muted: "#8A8280",
  divider: "#E8E0DA",
};

const badges = [
  { id: "b1", title: "Eco Starter", icon: "leaf", bg: "#F1D7C0" },
  { id: "b2", title: "Carbon King", icon: "zap", bg: "#E9DAD0" },
  { id: "b3", title: "Cycle Master", icon: "repeat", bg: "#F1D7C0" },
  { id: "b4", title: "Soil Savior", icon: "tree", bg: "#E9E9E9" },
  { id: "b5", title: "Earth First", icon: "globe", bg: "#F1D7C0" },
  { id: "b6", title: "Impact Pro", icon: "activity", bg: "#E9DAD0" },
  { id: "b7", title: "Flora Friend", icon: "leaf", bg: "#F1D7C0" },
  { id: "b8", title: "Sun Powered", icon: "sun", bg: "#E9E9E9" },
];

function StatItem({
  icon,
  label,
  sub,
}: {
  icon: any;
  label: string;
  sub: string;
}) {
  return (
    <View style={styles.stat}>
      <View style={styles.statIconWrap}>
        <Feather name={icon} size={18} color={COLORS.accent} />
      </View>
      <Text style={styles.statValue}>{label}</Text>
      <Text style={styles.statSub}>{sub}</Text>
    </View>
  );
}

function Donut({ percent }: { percent: number }) {
  // Approximate donut with a ring + center percent (no SVG in this project).
  const size = 110;
  const stroke = 10;
  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: "#E7D6D6",
        }}
      />
      <View
        style={{
          position: "absolute",
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: stroke,
          borderColor: COLORS.accent,
          borderTopColor: "transparent",
          transform: [{ rotate: `${(percent / 100) * 360}deg` }],
        }}
      />
      <Text style={styles.donutPercent}>{percent}%</Text>
      <Text style={styles.donutLabel}>GOAL</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: COLORS.bg,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  headerBrand: {
    fontSize: 18,
    fontWeight: "700",
    color: COLORS.text,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  bigTitle: {
    fontSize: 26,
    fontWeight: "800",
    color: COLORS.text,
    lineHeight: 30,
    marginBottom: 16,
    fontFamily: Platform.select({ ios: "Georgia", android: "serif" }),
  },
  scorePill: {
    backgroundColor: COLORS.accent,
    borderRadius: 14,
    paddingVertical: 18,
    paddingHorizontal: 18,
    marginBottom: 18,
  },
  scoreValue: {
    color: "#fff",
    fontSize: 30,
    fontWeight: "800",
  },
  scoreSub: {
    color: "#F0D7C8",
    marginTop: 6,
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 0.8,
  },
  monthCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#EFE7E5",
    marginBottom: 18,
  },
  monthTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: COLORS.text,
    marginBottom: 6,
  },
  monthDesc: {
    fontSize: 12,
    color: COLORS.muted,
    lineHeight: 16,
    marginBottom: 10,
  },
  donutRow: {
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  donutLegend: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  legendItem: { flex: 1 },
  legendLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: "700",
    marginBottom: 2,
  },
  legendValue: {
    fontSize: 12,
    color: COLORS.text,
    fontWeight: "800",
  },
  donutPercent: {
    fontSize: 22,
    fontWeight: "800",
    color: COLORS.accent,
  },
  donutLabel: {
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: "700",
    marginTop: -2,
    letterSpacing: 0.6,
  },
  twoStats: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 18,
  },
  stat: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 14,
    padding: 14,
    marginRight: 10,
    borderWidth: 1,
    borderColor: "#EFE7E5",
  },
  statIconWrap: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F1E2DF",
    marginBottom: 10,
  },
  statValue: {
    fontSize: 22,
    fontWeight: "900",
    color: COLORS.text,
  },
  statSub: {
    marginTop: 4,
    fontSize: 10,
    color: COLORS.muted,
    fontWeight: "800",
  },
  shareCard: {
    backgroundColor: COLORS.accentDark,
    borderRadius: 18,
    padding: 16,
    marginBottom: 18,
  },
  shareTitle: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "700",
    lineHeight: 16,
    marginBottom: 18,
  },
  shareTitleAccent: {
    color: "#F0D7C8",
  },
  shareBtn: {
    backgroundColor: "#fff",
    borderRadius: 999,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  shareBtnText: {
    color: COLORS.accent,
    fontWeight: "900",
    fontSize: 13,
  },
  badgeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  badgeHeaderTitle: {
    fontSize: 16,
    fontWeight: "900",
    color: COLORS.text,
  },
  badgeHeaderAction: {
    fontSize: 12,
    color: COLORS.muted,
    fontWeight: "800",
  },
  badgeGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  badgeItem: {
    width: "48%",
    alignItems: "center",
    marginBottom: 22,
  },
  badgeCard: {
    backgroundColor: "#fff",
    borderRadius: 18,
    padding: 16,
    marginTop: 10,
  },
  badgeCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },
  badgeName: {
    fontSize: 12,
    fontWeight: "800",
    color: COLORS.text,
    textAlign: "center",
  },
  badgeNameLocked: {
    color: "#BDBDBD",
  },
  /* Modal */
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalSheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 18,
    borderTopRightRadius: 18,
    paddingTop: 10,
    paddingHorizontal: 16,
    paddingBottom: 6,
    maxHeight: "78%",
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "900",
    color: COLORS.text,
  },
  modalCloseBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#F3F0EE",
    alignItems: "center",
    justifyContent: "center",
  },
  modalRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
  },
  modalRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: COLORS.divider,
    opacity: 0.9,
  },
  modalCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
  },
  modalRowTitle: {
    fontSize: 14,
    fontWeight: "800",
    color: COLORS.text,
    flex: 1,
  },
  bottomImageCard: {
    borderRadius: 18,
    overflow: "hidden",
    backgroundColor: "#1a1a1a",
    height: 120,
  },
  bottomImage: {
    ...StyleSheet.absoluteFillObject,
  },
  bottomImageOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    padding: 14,
    backgroundColor: "rgba(0,0,0,0.45)",
  },
  bottomImageTitle: {
    color: "#fff",
    fontWeight: "900",
    fontSize: 14,
    marginBottom: 4,
  },
  bottomImageSub: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "700",
    lineHeight: 14,
  },
});