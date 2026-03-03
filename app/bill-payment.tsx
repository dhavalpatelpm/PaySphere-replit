import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Alert,
  Animated,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";
import { useRef } from "react";

const BILL_TYPES = [
  { id: "electricity", label: "Electricity", icon: "flash" as const, color: "#FFB300", bg: "#FFF8E0", providers: ["BESCOM", "TNEB", "CESC", "MSEB"] },
  { id: "water", label: "Water", icon: "water" as const, color: "#0077B6", bg: "#E0F4FF", providers: ["BWSSB", "Delhi Jal Board", "HMWSSB"] },
  { id: "gas", label: "Piped Gas", icon: "flame" as const, color: "#E74C3C", bg: "#FFE8E6", providers: ["Mahanagar Gas", "Indraprastha Gas", "Adani Gas"] },
  { id: "dth", label: "DTH", icon: "tv" as const, color: "#5C35CC", bg: "#EDE8FF", providers: ["Tata Sky", "Airtel DTH", "Dish TV", "Sun Direct"] },
  { id: "broadband", label: "Broadband", icon: "wifi" as const, color: "#00B4D8", bg: "#E0F7FF", providers: ["Jio Fiber", "Airtel Broadband", "ACT Fibernet"] },
  { id: "mobile", label: "Mobile", icon: "phone-portrait" as const, color: "#00C48C", bg: "#E0FFF5", providers: ["Jio", "Airtel", "Vi", "BSNL"] },
];

type Step = "categories" | "form" | "success";

export default function BillPaymentScreen() {
  const insets = useSafeAreaInsets();
  const { addTransaction } = useApp();
  const [step, setStep] = useState<Step>("categories");
  const [selectedBill, setSelectedBill] = useState<(typeof BILL_TYPES)[0] | null>(null);
  const [selectedProvider, setSelectedProvider] = useState("");
  const [accountNo, setAccountNo] = useState("");
  const [amount, setAmount] = useState("");
  const successScale = useRef(new Animated.Value(0)).current;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const handleSelectBill = (bill: (typeof BILL_TYPES)[0]) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedBill(bill);
    setSelectedProvider(bill.providers[0]);
    setStep("form");
  };

  const handlePay = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    if (!accountNo) {
      Alert.alert("Missing Info", "Please enter your account number.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTransaction({
      type: "bill",
      title: `${selectedProvider}`,
      subtitle: `${selectedBill!.label} Bill`,
      amount: -amountNum,
      icon: selectedBill!.icon,
      color: selectedBill!.color,
      status: "success",
    });
    setStep("success");
    Animated.spring(successScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }).start();
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <TouchableOpacity
          onPress={() => {
            if (step === "form") setStep("categories");
            else router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === "categories" ? "Pay Bills" : step === "form" ? selectedBill?.label || "Bill Payment" : "Payment Done"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Categories Step */}
      {step === "categories" && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 16, paddingBottom: 40, gap: 12 }}>
          <Text style={styles.subtitle}>Select bill type to pay</Text>
          <View style={styles.categoriesGrid}>
            {BILL_TYPES.map((bill) => (
              <TouchableOpacity
                key={bill.id}
                style={styles.billTypeCard}
                onPress={() => handleSelectBill(bill)}
                activeOpacity={0.75}
              >
                <View style={[styles.billTypeIcon, { backgroundColor: bill.bg }]}>
                  <Ionicons name={bill.icon} size={32} color={bill.color} />
                </View>
                <Text style={styles.billTypeLabel}>{bill.label}</Text>
                <Ionicons name="chevron-forward" size={14} color={Colors.textTertiary} />
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      )}

      {/* Form Step */}
      {step === "form" && selectedBill && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ padding: 20, gap: 16, paddingBottom: 60 }}>
          {/* Bill Icon */}
          <View style={styles.billHeader}>
            <View style={[styles.billHeaderIcon, { backgroundColor: selectedBill.bg }]}>
              <Ionicons name={selectedBill.icon} size={36} color={selectedBill.color} />
            </View>
            <Text style={styles.billHeaderTitle}>{selectedBill.label} Bill</Text>
          </View>

          {/* Provider Selection */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Select Provider</Text>
            <View style={styles.providersRow}>
              {selectedBill.providers.map((provider) => (
                <TouchableOpacity
                  key={provider}
                  style={[styles.providerChip, selectedProvider === provider && styles.providerChipActive]}
                  onPress={() => {
                    setSelectedProvider(provider);
                    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                  }}
                >
                  <Text style={[styles.providerChipText, selectedProvider === provider && styles.providerChipTextActive]}>
                    {provider}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Account Number */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Consumer / Account Number</Text>
            <View style={styles.inputField}>
              <Ionicons name="card-outline" size={20} color={Colors.textSecondary} />
              <TextInput
                style={styles.input}
                placeholder="Enter account number"
                placeholderTextColor={Colors.textTertiary}
                value={accountNo}
                onChangeText={setAccountNo}
                keyboardType="number-pad"
              />
            </View>
          </View>

          {/* Amount */}
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Amount (₹)</Text>
            <View style={styles.inputField}>
              <Text style={styles.currencyPrefix}>₹</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter amount"
                placeholderTextColor={Colors.textTertiary}
                value={amount}
                onChangeText={setAmount}
                keyboardType="decimal-pad"
              />
            </View>
          </View>

          {/* Pay Button */}
          <TouchableOpacity
            style={[styles.payBtn, { backgroundColor: selectedBill.color }]}
            onPress={handlePay}
            activeOpacity={0.85}
          >
            <Ionicons name="flash" size={20} color="#fff" />
            <Text style={styles.payBtnText}>
              {amount ? `Pay ₹${parseFloat(amount).toLocaleString("en-IN")}` : "Proceed to Pay"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Success Step */}
      {step === "success" && (
        <View style={[styles.successContainer, { paddingBottom: bottomPadding + 20 }]}>
          <Animated.View style={[styles.successContent, { transform: [{ scale: successScale }] }]}>
            <View style={[styles.successCheck, { backgroundColor: selectedBill?.color || Colors.success }]}>
              <Ionicons name="checkmark" size={44} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Bill Paid!</Text>
            <Text style={styles.successAmount}>₹{parseFloat(amount).toLocaleString("en-IN")}</Text>
            <Text style={styles.successSub}>{selectedProvider} • {selectedBill?.label}</Text>

            <View style={styles.successDetail}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Reference ID</Text>
                <Text style={styles.successDetailValue}>REF{Date.now().toString().slice(-8)}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Account No.</Text>
                <Text style={styles.successDetailValue}>{accountNo}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Status</Text>
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                  <Text style={styles.successBadgeText}>Paid</Text>
                </View>
              </View>
            </View>
          </Animated.View>
          <TouchableOpacity style={styles.doneBtn} onPress={() => router.back()} activeOpacity={0.85}>
            <Text style={styles.doneBtnText}>Done</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text },
  subtitle: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.textSecondary },
  categoriesGrid: { gap: 10 },
  billTypeCard: { flexDirection: "row", alignItems: "center", gap: 14, backgroundColor: Colors.surface, borderRadius: 18, padding: 16 },
  billTypeIcon: { width: 56, height: 56, borderRadius: 18, alignItems: "center", justifyContent: "center" },
  billTypeLabel: { flex: 1, fontFamily: "Inter_600SemiBold", fontSize: 16, color: Colors.text },
  billHeader: { alignItems: "center", paddingVertical: 16, gap: 12 },
  billHeaderIcon: { width: 76, height: 76, borderRadius: 24, alignItems: "center", justifyContent: "center" },
  billHeaderTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text },
  fieldGroup: { gap: 8 },
  fieldLabel: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  providersRow: { flexDirection: "row", flexWrap: "wrap", gap: 8 },
  providerChip: { borderWidth: 1.5, borderColor: Colors.border, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.surface },
  providerChipActive: { borderColor: Colors.primary, backgroundColor: Colors.primary + "10" },
  providerChipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  providerChipTextActive: { color: Colors.primary },
  inputField: { flexDirection: "row", alignItems: "center", gap: 10, backgroundColor: Colors.surface, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 14, borderWidth: 1.5, borderColor: Colors.border },
  currencyPrefix: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  input: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 16, color: Colors.text },
  payBtn: { borderRadius: 18, paddingVertical: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, marginTop: 8, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  payBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "space-between", padding: 24 },
  successContent: { alignItems: "center", flex: 1, justifyContent: "center", gap: 6 },
  successCheck: { width: 84, height: 84, borderRadius: 42, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  successTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: Colors.text },
  successAmount: { fontFamily: "Inter_700Bold", fontSize: 40, color: Colors.primary, marginTop: 4 },
  successSub: { fontFamily: "Inter_500Medium", fontSize: 14, color: Colors.textSecondary },
  successDetail: { width: "100%", backgroundColor: Colors.surface, borderRadius: 18, padding: 18, gap: 12, marginTop: 20 },
  successDetailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  successDetailLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  successDetailValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text },
  successBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  successBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.success },
  doneBtn: { width: "100%", backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  doneBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
