import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Switch,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

interface SettingItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  sub?: string;
  iconBg: string;
  iconColor: string;
  toggle?: boolean;
  toggled?: boolean;
  onToggle?: (v: boolean) => void;
  chevron?: boolean;
  badge?: string;
}

function SettingItem({ icon, label, sub, iconBg, iconColor, toggle, toggled, onToggle, chevron = true, badge }: SettingItemProps) {
  return (
    <TouchableOpacity
      style={styles.settingItem}
      activeOpacity={toggle ? 1 : 0.7}
      onPress={toggle ? undefined : () => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
    >
      <View style={[styles.settingIcon, { backgroundColor: iconBg }]}>
        <Ionicons name={icon} size={20} color={iconColor} />
      </View>
      <View style={styles.settingInfo}>
        <Text style={styles.settingLabel}>{label}</Text>
        {sub && <Text style={styles.settingSub}>{sub}</Text>}
      </View>
      {badge && (
        <View style={styles.settingBadge}>
          <Text style={styles.settingBadgeText}>{badge}</Text>
        </View>
      )}
      {toggle ? (
        <Switch
          value={toggled}
          onValueChange={onToggle}
          trackColor={{ false: Colors.border, true: Colors.primary + "60" }}
          thumbColor={toggled ? Colors.primary : "#fff"}
        />
      ) : chevron ? (
        <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
      ) : null}
    </TouchableOpacity>
  );
}

export default function ProfileScreen() {
  const insets = useSafeAreaInsets();
  const { balance, transactions } = useApp();
  const [notifications, setNotifications] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const totalSent = transactions.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);
  const totalReceived = transactions.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 }}>
        {/* Profile Header */}
        <LinearGradient colors={["#1A0E3D", "#2D1B6B"]} style={[styles.profileHeader, { paddingTop: topPadding + 20 }]}>
          <View style={styles.avatarLarge}>
            <Text style={styles.avatarLargeText}>V</Text>
          </View>
          <Text style={styles.profileName}>Vikram Kumar</Text>
          <Text style={styles.profilePhone}>+91 9876543210</Text>
          <Text style={styles.profileUpi}>vikram@paysphere</Text>

          <View style={styles.kycBadge}>
            <Ionicons name="checkmark-circle" size={14} color="#00C48C" />
            <Text style={styles.kycText}>KYC Verified</Text>
          </View>
        </LinearGradient>

        {/* Stats */}
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statValue}>{formatCurrency(balance)}</Text>
            <Text style={styles.statLabel}>Wallet Balance</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.success }]}>{formatCurrency(totalReceived)}</Text>
            <Text style={styles.statLabel}>Total Received</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statCard}>
            <Text style={[styles.statValue, { color: Colors.error }]}>{formatCurrency(totalSent)}</Text>
            <Text style={styles.statLabel}>Total Spent</Text>
          </View>
        </View>

        {/* Linked Accounts */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Linked Accounts</Text>
          <View style={styles.card}>
            <TouchableOpacity style={styles.bankRow} activeOpacity={0.7}>
              <View style={[styles.bankIcon, { backgroundColor: "#E0F0FF" }]}>
                <Ionicons name="business" size={20} color="#0077B6" />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>HDFC Bank</Text>
                <Text style={styles.bankAccount}>•••• •••• 4521 • Savings</Text>
              </View>
              <View style={styles.primaryBadge}>
                <Text style={styles.primaryBadgeText}>Primary</Text>
              </View>
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={styles.bankRow} activeOpacity={0.7}>
              <View style={[styles.bankIcon, { backgroundColor: "#E8FFE8" }]}>
                <Ionicons name="business" size={20} color="#2E7D32" />
              </View>
              <View style={styles.bankInfo}>
                <Text style={styles.bankName}>SBI</Text>
                <Text style={styles.bankAccount}>•••• •••• 7890 • Savings</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
            <View style={styles.divider} />
            <TouchableOpacity style={[styles.bankRow, { justifyContent: "center" }]} activeOpacity={0.7}>
              <Ionicons name="add-circle-outline" size={20} color={Colors.primary} />
              <Text style={styles.addBankText}>Add Bank Account</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <SettingItem icon="notifications-outline" label="Notifications" iconBg="#EDE8FF" iconColor={Colors.primary} toggle toggled={notifications} onToggle={setNotifications} chevron={false} />
            <View style={styles.divider} />
            <SettingItem icon="finger-print" label="Biometric Auth" iconBg="#E0FFF5" iconColor={Colors.accent} toggle toggled={biometric} onToggle={setBiometric} chevron={false} />
            <View style={styles.divider} />
            <SettingItem icon="language-outline" label="Language" sub="English" iconBg="#FFF8E0" iconColor="#FFB300" />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Security & Privacy</Text>
          <View style={styles.card}>
            <SettingItem icon="lock-closed-outline" label="Change PIN" iconBg="#EDE8FF" iconColor={Colors.primary} />
            <View style={styles.divider} />
            <SettingItem icon="shield-outline" label="Privacy Settings" iconBg="#E0FFF5" iconColor={Colors.accent} />
            <View style={styles.divider} />
            <SettingItem icon="document-text-outline" label="Transaction Limit" sub="UPI: ₹1,00,000/day" iconBg="#FFF0E8" iconColor={Colors.orange} />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Support</Text>
          <View style={styles.card}>
            <SettingItem icon="help-circle-outline" label="Help & Support" iconBg="#EDE8FF" iconColor={Colors.primary} badge="24/7" />
            <View style={styles.divider} />
            <SettingItem icon="star-outline" label="Rate PaySphere" iconBg="#FFF8E0" iconColor="#FFB300" />
            <View style={styles.divider} />
            <SettingItem icon="information-circle-outline" label="About" sub="Version 1.0.0" iconBg="#F4F2FF" iconColor={Colors.textSecondary} />
          </View>
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.8}>
          <Ionicons name="log-out-outline" size={20} color={Colors.error} />
          <Text style={styles.logoutText}>Sign Out</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  profileHeader: { alignItems: "center", paddingBottom: 28, paddingHorizontal: 20 },
  avatarLarge: { width: 76, height: 76, borderRadius: 38, backgroundColor: Colors.accent, alignItems: "center", justifyContent: "center", marginBottom: 12, borderWidth: 3, borderColor: "rgba(255,255,255,0.3)" },
  avatarLargeText: { fontFamily: "Inter_700Bold", fontSize: 30, color: "#fff" },
  profileName: { fontFamily: "Inter_700Bold", fontSize: 22, color: "#fff", marginBottom: 4 },
  profilePhone: { fontFamily: "Inter_400Regular", fontSize: 14, color: "rgba(255,255,255,0.7)" },
  profileUpi: { fontFamily: "Inter_500Medium", fontSize: 13, color: "rgba(255,255,255,0.6)", marginTop: 2 },
  kycBadge: { flexDirection: "row", alignItems: "center", gap: 5, backgroundColor: "rgba(0,196,140,0.2)", borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5, marginTop: 12 },
  kycText: { fontFamily: "Inter_600SemiBold", fontSize: 12, color: "#00C48C" },
  statsRow: { flexDirection: "row", backgroundColor: Colors.surface, marginHorizontal: 16, marginTop: -1, borderRadius: 18, padding: 16, shadowColor: "#1A0E3D", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, elevation: 4 },
  statCard: { flex: 1, alignItems: "center" },
  statValue: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text, marginBottom: 4 },
  statLabel: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textSecondary, textAlign: "center" },
  statDivider: { width: 1, backgroundColor: Colors.border },
  section: { marginTop: 20, paddingHorizontal: 16 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.text, marginBottom: 10 },
  card: { backgroundColor: Colors.surface, borderRadius: 18, overflow: "hidden" },
  settingItem: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  settingIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  settingInfo: { flex: 1 },
  settingLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  settingSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  settingBadge: { backgroundColor: Colors.accent + "20", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3, marginRight: 6 },
  settingBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: Colors.accent },
  divider: { height: 1, backgroundColor: Colors.border, marginLeft: 66 },
  bankRow: { flexDirection: "row", alignItems: "center", padding: 14, gap: 12 },
  bankIcon: { width: 40, height: 40, borderRadius: 12, alignItems: "center", justifyContent: "center" },
  bankInfo: { flex: 1 },
  bankName: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  bankAccount: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  primaryBadge: { backgroundColor: Colors.primary + "15", borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  primaryBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: Colors.primary },
  addBankText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.primary, marginLeft: 4 },
  logoutBtn: { flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 8, marginHorizontal: 16, marginTop: 20, padding: 16, backgroundColor: Colors.error + "12", borderRadius: 16 },
  logoutText: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.error },
});
