import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
  Platform,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");
const H_PAD = 16;

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const days = Math.floor(hours / 24);
  if (hours < 1) return "Just now";
  if (hours < 24) return `${hours}h ago`;
  if (days === 1) return "Yesterday";
  return `${days}d ago`;
}

interface QuickActionProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  color: string;
  bg: string;
  onPress: () => void;
}

function QuickAction({ icon, label, color, bg, onPress }: QuickActionProps) {
  const scale = useRef(new Animated.Value(1)).current;

  const handlePress = () => {
    Animated.sequence([
      Animated.timing(scale, { toValue: 0.92, duration: 80, useNativeDriver: true }),
      Animated.timing(scale, { toValue: 1, duration: 80, useNativeDriver: true }),
    ]).start();
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    onPress();
  };

  return (
    <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
      <Animated.View style={[styles.quickAction, { transform: [{ scale }] }]}>
        <View style={[styles.quickActionIcon, { backgroundColor: bg }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <Text style={styles.quickActionLabel}>{label}</Text>
      </Animated.View>
    </TouchableOpacity>
  );
}

const OFFERS = [
  { id: "1", title: "10% cashback on groceries", sub: "Min ₹500 • Blinkit", color1: "#FF6B35", color2: "#FF8F60" },
  { id: "2", title: "Zero-fee SIP investment", sub: "Start with just ₹100", color1: "#5C35CC", color2: "#7B5CE8" },
  { id: "3", title: "Instant personal loans", sub: "Up to ₹5 Lakhs", color1: "#00C48C", color2: "#00E5A4" },
];

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { balance, transactions } = useApp();
  const [balanceVisible, setBalanceVisible] = useState(true);
  const recentTxns = transactions.slice(0, 4);

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 }}
      >
        {/* ── HEADER GRADIENT ── */}
        <LinearGradient
          colors={["#1A0E3D", "#2D1B6B", "#5C35CC"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={[styles.header, { paddingTop: topPadding + 16 }]}
        >
          <View style={styles.headerTop}>
            <View>
              <Text style={styles.greetingText}>Good morning,</Text>
              <Text style={styles.userName}>Dhaval Patel</Text>
            </View>
            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.notifBtn} onPress={() => {}}>
                <Ionicons name="notifications-outline" size={22} color="rgba(255,255,255,0.9)" />
                <View style={styles.notifDot} />
              </TouchableOpacity>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>D</Text>
              </View>
            </View>
          </View>

          {/* Balance Card */}
          <View style={styles.balanceCard}>
            <View style={styles.balanceRow}>
              <View style={styles.balanceLeft}>
                <Text style={styles.balanceLabel}>PaySphere Wallet</Text>
                <View style={styles.balanceAmountRow}>
                  <Text style={styles.balanceAmount}>
                    {balanceVisible ? formatCurrency(balance) : "₹ ••••••"}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setBalanceVisible(!balanceVisible)}
                    style={styles.eyeBtn}
                  >
                    <Ionicons
                      name={balanceVisible ? "eye-outline" : "eye-off-outline"}
                      size={18}
                      color="rgba(255,255,255,0.7)"
                    />
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.upiTag}>
                <Text style={styles.upiText}>UPI</Text>
              </View>
            </View>
            <View style={styles.balanceDivider} />
            <View style={styles.balanceFooter}>
              <View style={styles.balanceStat}>
                <Ionicons name="arrow-down-circle" size={15} color="#00C48C" />
                <Text style={styles.balanceStatText}>₹75,00,000 received</Text>
              </View>
              <View style={styles.balanceStat}>
                <Ionicons name="arrow-up-circle" size={15} color="#FF6B8A" />
                <Text style={styles.balanceStatText}>₹13,00,000 spent</Text>
              </View>
            </View>
          </View>
        </LinearGradient>

        {/* ── QUICK ACTIONS ── */}
        <View style={styles.quickActionsCard}>
          <View style={styles.quickActionsRow}>
            <QuickAction icon="paper-plane-outline" label="Send"    color="#5C35CC" bg="#EDE8FF" onPress={() => router.push("/send-money")} />
            <QuickAction icon="arrow-down-outline"  label="Receive" color="#00C48C" bg="#E0FFF5" onPress={() => {}} />
            <QuickAction icon="scan-outline"         label="Scan"    color="#FF6B35" bg="#FFF0E8" onPress={() => {}} />
            <QuickAction icon="flash-outline"        label="Bills"   color="#FFB300" bg="#FFF8E0" onPress={() => router.push("/bill-payment")} />
          </View>
          <View style={styles.divider} />
          <View style={styles.quickActionsRow}>
            <QuickAction icon="phone-portrait-outline" label="Recharge" color="#5C35CC" bg="#EDE8FF" onPress={() => router.push("/bill-payment")} />
            <QuickAction icon="airplane-outline"       label="Travel"   color="#00B4D8" bg="#E0F7FF" onPress={() => {}} />
            <QuickAction icon="trending-up-outline"    label="Invest"   color="#00C48C" bg="#E0FFF5" onPress={() => router.push("/(tabs)/finance")} />
            <QuickAction icon="ellipsis-horizontal"    label="More"     color="#6B5FA0" bg="#F4F2FF" onPress={() => {}} />
          </View>
        </View>

        {/* ── OFFERS ── */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Offers for you</Text>
          </View>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.offerScroll}
          >
            {OFFERS.map((offer) => (
              <LinearGradient
                key={offer.id}
                colors={[offer.color1, offer.color2]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.offerCard}
              >
                <Text style={styles.offerTitle}>{offer.title}</Text>
                <Text style={styles.offerSub}>{offer.sub}</Text>
                <View style={styles.offerBtn}>
                  <Text style={styles.offerBtnText}>Claim Now</Text>
                  <Ionicons name="arrow-forward" size={12} color="#fff" />
                </View>
              </LinearGradient>
            ))}
          </ScrollView>
        </View>

        {/* ── RECENT TRANSACTIONS ── */}
        <View style={styles.section}>
          {/* Row header — same H_PAD, no extra padding on title text */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Activity</Text>
            <TouchableOpacity onPress={() => router.push("/transaction-history")}>
              <Text style={styles.seeAll}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.txnList}>
            {recentTxns.map((tx) => (
              <TouchableOpacity key={tx.id} style={styles.txnItem} activeOpacity={0.7}>
                <View style={[styles.txnIcon, { backgroundColor: tx.color + "20" }]}>
                  <Ionicons name={tx.icon as keyof typeof Ionicons.glyphMap} size={20} color={tx.color} />
                </View>
                <View style={styles.txnInfo}>
                  <Text style={styles.txnTitle}>{tx.title}</Text>
                  <Text style={styles.txnSub}>{tx.subtitle}</Text>
                </View>
                <View style={styles.txnRight}>
                  <Text style={[styles.txnAmount, { color: tx.amount > 0 ? Colors.success : Colors.text }]}>
                    {tx.amount > 0 ? "+" : ""}{formatCurrency(tx.amount)}
                  </Text>
                  <Text style={styles.txnTime}>{formatTime(tx.date)}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header ──
  header: {
    paddingHorizontal: H_PAD,
    paddingBottom: 28,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  greetingText: {
    fontFamily: "Inter_400Regular",
    fontSize: 13,
    color: "rgba(255,255,255,0.65)",
  },
  userName: {
    fontFamily: "Inter_700Bold",
    fontSize: 22,
    color: "#fff",
    marginTop: 2,
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  notifBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
  notifDot: {
    position: "absolute",
    top: 9,
    right: 9,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#FF4B6B",
    borderWidth: 1.5,
    borderColor: "#2D1B6B",
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.accent,
    alignItems: "center",
    justifyContent: "center",
  },
  avatarText: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
  },

  // ── Balance Card ──
  balanceCard: {
    backgroundColor: "rgba(255,255,255,0.12)",
    borderRadius: 20,
    padding: 18,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.2)",
  },
  balanceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  balanceLeft: {
    flex: 1,
  },
  balanceLabel: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.6)",
    marginBottom: 6,
  },
  balanceAmountRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  balanceAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    color: "#fff",
  },
  eyeBtn: {
    padding: 4,
  },
  upiTag: {
    backgroundColor: "rgba(255,255,255,0.2)",
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 5,
    alignSelf: "flex-start",
  },
  upiText: {
    fontFamily: "Inter_700Bold",
    fontSize: 12,
    color: "#fff",
  },
  balanceDivider: {
    height: 1,
    backgroundColor: "rgba(255,255,255,0.15)",
    marginVertical: 14,
  },
  balanceFooter: {
    flexDirection: "row",
    gap: 20,
  },
  balanceStat: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  balanceStatText: {
    fontFamily: "Inter_500Medium",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
  },

  // ── Quick Actions ──
  quickActionsCard: {
    backgroundColor: Colors.surface,
    marginHorizontal: H_PAD,
    marginTop: -16,
    borderRadius: 20,
    paddingHorizontal: H_PAD,
    paddingTop: 18,
    paddingBottom: 14,
    gap: 0,
    shadowColor: "#1A0E3D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 14,
    elevation: 5,
  },
  quickActionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 4,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 10,
  },
  quickAction: {
    alignItems: "center",
    width: (width - H_PAD * 2 - H_PAD * 2) / 4,
    gap: 6,
  },
  quickActionIcon: {
    width: 50,
    height: 50,
    borderRadius: 15,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionLabel: {
    fontFamily: "Inter_500Medium",
    fontSize: 11.5,
    color: Colors.text,
    textAlign: "center",
  },

  // ── Sections ──
  section: {
    marginTop: 24,
  },
  // Section title used both standalone and inside sectionHeader
  sectionTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 17,
    color: Colors.text,
  },
  // Row header with title + "see all" — owns the H_PAD
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: H_PAD,
    marginBottom: 12,
  },
  seeAll: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 13,
    color: Colors.primary,
  },

  // ── Offers ──
  offerScroll: {
    paddingHorizontal: H_PAD,
    gap: 12,
  },
  offerCard: {
    width: width * 0.72,
    borderRadius: 18,
    padding: 18,
    minHeight: 115,
    justifyContent: "space-between",
  },
  offerTitle: {
    fontFamily: "Inter_700Bold",
    fontSize: 16,
    color: "#fff",
    marginBottom: 4,
  },
  offerSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: "rgba(255,255,255,0.8)",
    marginBottom: 14,
  },
  offerBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: "rgba(255,255,255,0.25)",
    alignSelf: "flex-start",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  offerBtnText: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 12,
    color: "#fff",
  },

  // ── Transactions ──
  txnList: {
    paddingHorizontal: H_PAD,
    gap: 8,
  },
  txnItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: Colors.surface,
    paddingHorizontal: 14,
    paddingVertical: 13,
    borderRadius: 14,
    gap: 12,
  },
  txnIcon: {
    width: 44,
    height: 44,
    borderRadius: 13,
    alignItems: "center",
    justifyContent: "center",
  },
  txnInfo: {
    flex: 1,
  },
  txnTitle: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 14,
    color: Colors.text,
  },
  txnSub: {
    fontFamily: "Inter_400Regular",
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  txnRight: {
    alignItems: "flex-end",
  },
  txnAmount: {
    fontFamily: "Inter_700Bold",
    fontSize: 14,
  },
  txnTime: {
    fontFamily: "Inter_400Regular",
    fontSize: 11,
    color: Colors.textTertiary,
    marginTop: 3,
  },
});
