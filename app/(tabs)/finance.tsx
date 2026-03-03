import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";

const { width } = Dimensions.get("window");

const BILL_CATEGORIES = [
  { id: "electricity", label: "Electricity", icon: "flash-outline" as const, color: "#FFB300", bg: "#FFF8E0" },
  { id: "water", label: "Water", icon: "water-outline" as const, color: "#0077B6", bg: "#E0F4FF" },
  { id: "gas", label: "Piped Gas", icon: "flame-outline" as const, color: "#E74C3C", bg: "#FFE8E6" },
  { id: "dth", label: "DTH", icon: "tv-outline" as const, color: "#5C35CC", bg: "#EDE8FF" },
  { id: "cable", label: "Cable TV", icon: "desktop-outline" as const, color: "#00B4D8", bg: "#E0F7FF" },
  { id: "rent", label: "Rent", icon: "home-outline" as const, color: "#00C48C", bg: "#E0FFF5" },
  { id: "loan", label: "Loan EMI", icon: "cash-outline" as const, color: "#FF6B35", bg: "#FFF0E8" },
  { id: "insurance", label: "Insurance", icon: "shield-checkmark-outline" as const, color: "#5C35CC", bg: "#EDE8FF" },
];

const FINANCE_CARDS = [
  {
    id: "invest",
    title: "Investments",
    subtitle: "Build, manage & grow your wealth",
    value: "₹1,24,500",
    change: "+12.4%",
    positive: true,
    icon: "trending-up" as const,
    color1: "#5C35CC",
    color2: "#7B5CE8",
  },
  {
    id: "insurance",
    title: "Insurance",
    subtitle: "Protect, plan & secure your future",
    value: "3 Policies",
    change: "Active",
    positive: true,
    icon: "shield-checkmark" as const,
    color1: "#0077B6",
    color2: "#00B4D8",
  },
  {
    id: "lending",
    title: "Lending",
    subtitle: "Access quick, transparent loans",
    value: "₹5L Eligible",
    change: "Pre-approved",
    positive: true,
    icon: "cash" as const,
    color1: "#00C48C",
    color2: "#00E5A4",
  },
];

const SIP_OPTIONS = [
  { id: "s1", name: "Parag Parikh Flexi Cap", category: "Equity", returns: "18.4% p.a.", risk: "Moderate", minSIP: "₹500" },
  { id: "s2", name: "Axis Bluechip Fund", category: "Large Cap", returns: "14.2% p.a.", risk: "Low", minSIP: "₹500" },
  { id: "s3", name: "Mirae Asset ELSS", category: "Tax Saver", returns: "16.8% p.a.", risk: "Moderate", minSIP: "₹500" },
];

export default function FinanceScreen() {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState<"overview" | "bills" | "invest">("overview");
  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  return (
    <View style={styles.container}>
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <Text style={styles.headerTitle}>Finance</Text>
        <TouchableOpacity style={styles.helpBtn}>
          <Ionicons name="help-circle-outline" size={24} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <View style={styles.tabBar}>
        {(["overview", "bills", "invest"] as const).map((tab) => (
          <TouchableOpacity
            key={tab}
            style={[styles.tab, activeTab === tab && styles.tabActive]}
            onPress={() => {
              setActiveTab(tab);
              Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
            }}
          >
            <Text style={[styles.tabLabel, activeTab === tab && styles.tabLabelActive]}>
              {tab === "overview" ? "Overview" : tab === "bills" ? "Pay Bills" : "Invest"}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 }}>
        {activeTab === "overview" && (
          <View style={styles.content}>
            {/* Summary */}
            <LinearGradient colors={["#1A0E3D", "#2D1B6B"]} style={styles.summaryCard}>
              <Text style={styles.summaryLabel}>Total Portfolio Value</Text>
              <Text style={styles.summaryValue}>₹1,24,500</Text>
              <View style={styles.summaryChange}>
                <Ionicons name="trending-up" size={16} color="#00C48C" />
                <Text style={styles.summaryChangeText}>+₹13,200 (12.4%) this month</Text>
              </View>
              <View style={styles.summaryDivider} />
              <View style={styles.summaryStats}>
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatLabel}>Invested</Text>
                  <Text style={styles.summaryStatValue}>₹1,11,300</Text>
                </View>
                <View style={styles.summaryStatDivider} />
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatLabel}>Returns</Text>
                  <Text style={[styles.summaryStatValue, { color: "#00C48C" }]}>+₹13,200</Text>
                </View>
                <View style={styles.summaryStatDivider} />
                <View style={styles.summaryStat}>
                  <Text style={styles.summaryStatLabel}>XIRR</Text>
                  <Text style={[styles.summaryStatValue, { color: "#00C48C" }]}>18.4%</Text>
                </View>
              </View>
            </LinearGradient>

            {/* Finance Cards */}
            {FINANCE_CARDS.map((card) => (
              <TouchableOpacity key={card.id} activeOpacity={0.85}>
                <LinearGradient
                  colors={[card.color1, card.color2]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={styles.financeCard}
                >
                  <View style={styles.financeCardLeft}>
                    <View style={styles.financeCardIconBg}>
                      <Ionicons name={card.icon} size={24} color="#fff" />
                    </View>
                    <View>
                      <Text style={styles.financeCardTitle}>{card.title}</Text>
                      <Text style={styles.financeCardSub}>{card.subtitle}</Text>
                    </View>
                  </View>
                  <View style={styles.financeCardRight}>
                    <Text style={styles.financeCardValue}>{card.value}</Text>
                    <View style={[styles.financeCardBadge, { backgroundColor: card.positive ? "rgba(0,196,140,0.3)" : "rgba(255,75,107,0.3)" }]}>
                      <Text style={[styles.financeCardBadgeText, { color: card.positive ? "#00E5A4" : "#FF6B8A" }]}>{card.change}</Text>
                    </View>
                  </View>
                </LinearGradient>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {activeTab === "bills" && (
          <View style={styles.content}>
            <Text style={styles.billsTitle}>Pay all your bills in one place</Text>
            <View style={styles.billsGrid}>
              {BILL_CATEGORIES.map((bill) => (
                <TouchableOpacity
                  key={bill.id}
                  style={styles.billCard}
                  onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                  activeOpacity={0.75}
                >
                  <View style={[styles.billIcon, { backgroundColor: bill.bg }]}>
                    <Ionicons name={bill.icon} size={26} color={bill.color} />
                  </View>
                  <Text style={styles.billLabel}>{bill.label}</Text>
                </TouchableOpacity>
              ))}
            </View>

            {/* Pending Bills */}
            <View style={styles.pendingSection}>
              <Text style={styles.pendingSectionTitle}>Upcoming Bills</Text>
              <View style={styles.pendingBill}>
                <View style={[styles.pendingIcon, { backgroundColor: "#FFF8E0" }]}>
                  <Ionicons name="flash" size={20} color="#FFB300" />
                </View>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingTitle}>Electricity - BESCOM</Text>
                  <Text style={styles.pendingDue}>Due in 3 days</Text>
                </View>
                <View>
                  <Text style={styles.pendingAmount}>₹1,840</Text>
                  <TouchableOpacity style={styles.payNowBtn}>
                    <Text style={styles.payNowText}>Pay Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
              <View style={styles.pendingBill}>
                <View style={[styles.pendingIcon, { backgroundColor: "#E0F4FF" }]}>
                  <Ionicons name="water" size={20} color="#0077B6" />
                </View>
                <View style={styles.pendingInfo}>
                  <Text style={styles.pendingTitle}>Water Bill - BWSSB</Text>
                  <Text style={styles.pendingDue}>Due in 8 days</Text>
                </View>
                <View>
                  <Text style={styles.pendingAmount}>₹340</Text>
                  <TouchableOpacity style={styles.payNowBtn}>
                    <Text style={styles.payNowText}>Pay Now</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        )}

        {activeTab === "invest" && (
          <View style={styles.content}>
            <LinearGradient colors={["#5C35CC", "#7B5CE8"]} style={styles.investHero}>
              <Text style={styles.investHeroTitle}>Start your SIP today</Text>
              <Text style={styles.investHeroSub}>Zero commission • Instant activation</Text>
              <View style={styles.investStats}>
                <View style={styles.investStat}>
                  <Text style={styles.investStatValue}>₹100</Text>
                  <Text style={styles.investStatLabel}>Min SIP</Text>
                </View>
                <View style={styles.investStatDiv} />
                <View style={styles.investStat}>
                  <Text style={styles.investStatValue}>5000+</Text>
                  <Text style={styles.investStatLabel}>Funds</Text>
                </View>
                <View style={styles.investStatDiv} />
                <View style={styles.investStat}>
                  <Text style={styles.investStatValue}>0%</Text>
                  <Text style={styles.investStatLabel}>Commission</Text>
                </View>
              </View>
            </LinearGradient>

            <Text style={styles.sectionLabel}>Top Performing Funds</Text>
            {SIP_OPTIONS.map((sip) => (
              <TouchableOpacity key={sip.id} style={styles.sipCard} activeOpacity={0.8}>
                <View style={styles.sipLeft}>
                  <View style={styles.sipIconBg}>
                    <Ionicons name="trending-up" size={18} color={Colors.primary} />
                  </View>
                  <View>
                    <Text style={styles.sipName}>{sip.name}</Text>
                    <View style={styles.sipMeta}>
                      <Text style={styles.sipCategory}>{sip.category}</Text>
                      <View style={[styles.sipRisk, { backgroundColor: sip.risk === "Low" ? "#E0FFF5" : "#FFF8E0" }]}>
                        <Text style={[styles.sipRiskText, { color: sip.risk === "Low" ? Colors.accent : "#FFB300" }]}>{sip.risk}</Text>
                      </View>
                    </View>
                  </View>
                </View>
                <View style={styles.sipRight}>
                  <Text style={styles.sipReturns}>{sip.returns}</Text>
                  <Text style={styles.sipMin}>Min {sip.minSIP}</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 20, paddingBottom: 12, backgroundColor: Colors.surface },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 24, color: Colors.text },
  helpBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  tabBar: { flexDirection: "row", backgroundColor: Colors.surface, paddingHorizontal: 16, paddingVertical: 8, gap: 8 },
  tab: { flex: 1, paddingVertical: 8, borderRadius: 12, alignItems: "center" },
  tabActive: { backgroundColor: Colors.primary },
  tabLabel: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.textSecondary },
  tabLabelActive: { color: "#fff" },
  content: { padding: 16, gap: 12 },
  summaryCard: { borderRadius: 20, padding: 20 },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.6)", marginBottom: 6 },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 34, color: "#fff", marginBottom: 8 },
  summaryChange: { flexDirection: "row", alignItems: "center", gap: 6 },
  summaryChangeText: { fontFamily: "Inter_500Medium", fontSize: 13, color: "#00C48C" },
  summaryDivider: { height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginVertical: 16 },
  summaryStats: { flexDirection: "row", alignItems: "center" },
  summaryStat: { flex: 1, alignItems: "center" },
  summaryStatLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.6)", marginBottom: 4 },
  summaryStatValue: { fontFamily: "Inter_700Bold", fontSize: 15, color: "#fff" },
  summaryStatDivider: { width: 1, height: 32, backgroundColor: "rgba(255,255,255,0.15)" },
  financeCard: { borderRadius: 18, padding: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between" },
  financeCardLeft: { flexDirection: "row", alignItems: "center", gap: 14, flex: 1 },
  financeCardIconBg: { width: 44, height: 44, borderRadius: 14, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "center", justifyContent: "center" },
  financeCardTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  financeCardSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.7)", marginTop: 2, maxWidth: 160 },
  financeCardRight: { alignItems: "flex-end" },
  financeCardValue: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff", marginBottom: 6 },
  financeCardBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  financeCardBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 11 },
  billsTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.textSecondary, marginBottom: 4 },
  billsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  billCard: { width: (width - 56) / 4, alignItems: "center", gap: 8 },
  billIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  billLabel: { fontFamily: "Inter_500Medium", fontSize: 11, color: Colors.text, textAlign: "center" },
  pendingSection: { marginTop: 8 },
  pendingSectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.text, marginBottom: 12 },
  pendingBill: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, borderRadius: 16, padding: 14, gap: 12, marginBottom: 8 },
  pendingIcon: { width: 44, height: 44, borderRadius: 13, alignItems: "center", justifyContent: "center" },
  pendingInfo: { flex: 1 },
  pendingTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  pendingDue: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.warning, marginTop: 2 },
  pendingAmount: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text, textAlign: "right", marginBottom: 6 },
  payNowBtn: { backgroundColor: Colors.primary, borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5, alignItems: "center" },
  payNowText: { fontFamily: "Inter_600SemiBold", fontSize: 11, color: "#fff" },
  investHero: { borderRadius: 20, padding: 20 },
  investHeroTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff", marginBottom: 4 },
  investHeroSub: { fontFamily: "Inter_400Regular", fontSize: 13, color: "rgba(255,255,255,0.75)", marginBottom: 16 },
  investStats: { flexDirection: "row", alignItems: "center", backgroundColor: "rgba(255,255,255,0.15)", borderRadius: 14, padding: 14 },
  investStat: { flex: 1, alignItems: "center" },
  investStatValue: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
  investStatLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: "rgba(255,255,255,0.7)", marginTop: 2 },
  investStatDiv: { width: 1, height: 36, backgroundColor: "rgba(255,255,255,0.2)" },
  sectionLabel: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text },
  sipCard: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: Colors.surface, borderRadius: 16, padding: 16, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 6, elevation: 2 },
  sipLeft: { flexDirection: "row", alignItems: "center", gap: 12, flex: 1 },
  sipIconBg: { width: 40, height: 40, borderRadius: 12, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  sipName: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text, maxWidth: 180 },
  sipMeta: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  sipCategory: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary },
  sipRisk: { borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2 },
  sipRiskText: { fontFamily: "Inter_500Medium", fontSize: 10 },
  sipRight: { alignItems: "flex-end" },
  sipReturns: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.accent },
  sipMin: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginTop: 2 },
});
