import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Animated,
  Platform,
  Dimensions,
  Alert,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");

type Step = "contacts" | "amount" | "success";

interface Contact {
  id: string;
  name: string;
  phone: string;
  upiId: string;
  avatar: string;
  recent: boolean;
}

export default function SendMoneyScreen() {
  const insets = useSafeAreaInsets();
  const { contacts, balance, addTransaction } = useApp();
  const [step, setStep] = useState<Step>("contacts");
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null);
  const [amount, setAmount] = useState("");
  const [note, setNote] = useState("");
  const [search, setSearch] = useState("");
  const successScale = useRef(new Animated.Value(0)).current;

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const filteredContacts = contacts.filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.phone.includes(search) ||
      c.upiId.toLowerCase().includes(search.toLowerCase())
  );

  const recentContacts = contacts.filter((c) => c.recent);

  const handleSelectContact = (contact: Contact) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setSelectedContact(contact);
    setStep("amount");
  };

  const handleSend = () => {
    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid amount.");
      return;
    }
    if (amountNum > balance) {
      Alert.alert("Insufficient Balance", "You don't have enough balance.");
      return;
    }
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    addTransaction({
      type: "sent",
      title: selectedContact!.name,
      subtitle: `UPI • ${selectedContact!.upiId}`,
      amount: -amountNum,
      icon: "arrow-up",
      color: Colors.error,
      status: "success",
    });
    setStep("success");
    Animated.spring(successScale, { toValue: 1, tension: 80, friction: 6, useNativeDriver: true }).start();
  };

  const QUICK_AMOUNTS = [100, 200, 500, 1000, 2000, 5000];

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <TouchableOpacity
          onPress={() => {
            if (step === "amount") setStep("contacts");
            else router.back();
          }}
          style={styles.backBtn}
        >
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {step === "contacts" ? "Send Money" : step === "amount" ? "Enter Amount" : "Payment Sent"}
        </Text>
        <View style={{ width: 40 }} />
      </View>

      {/* Contacts Step */}
      {step === "contacts" && (
        <View style={styles.flex}>
          <View style={styles.searchContainer}>
            <View style={styles.searchBar}>
              <Ionicons name="search" size={18} color={Colors.textTertiary} />
              <TextInput
                style={styles.searchInput}
                placeholder="Name, phone or UPI ID"
                placeholderTextColor={Colors.textTertiary}
                value={search}
                onChangeText={setSearch}
              />
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
            {!search && (
              <View>
                <Text style={styles.sectionTitle}>Recent</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.recentScroll}>
                  {recentContacts.map((contact) => (
                    <TouchableOpacity key={contact.id} onPress={() => handleSelectContact(contact)} style={styles.recentContact} activeOpacity={0.75}>
                      <View style={styles.recentAvatar}>
                        <Text style={styles.recentAvatarText}>{contact.avatar}</Text>
                      </View>
                      <Text style={styles.recentName} numberOfLines={1}>{contact.name.split(" ")[0]}</Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}

            <Text style={styles.sectionTitle}>{search ? "Search Results" : "All Contacts"}</Text>
            {filteredContacts.length === 0 ? (
              <View style={styles.emptyState}>
                <Ionicons name="person-outline" size={44} color={Colors.textTertiary} />
                <Text style={styles.emptyText}>No contacts found</Text>
              </View>
            ) : (
              <View style={styles.contactList}>
                {filteredContacts.map((contact) => (
                  <TouchableOpacity key={contact.id} style={styles.contactItem} onPress={() => handleSelectContact(contact)} activeOpacity={0.7}>
                    <View style={styles.contactAvatar}>
                      <Text style={styles.contactAvatarText}>{contact.avatar}</Text>
                    </View>
                    <View style={styles.contactInfo}>
                      <Text style={styles.contactName}>{contact.name}</Text>
                      <Text style={styles.contactUpi}>{contact.upiId}</Text>
                    </View>
                    <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        </View>
      )}

      {/* Amount Step */}
      {step === "amount" && selectedContact && (
        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 40 }}>
          {/* Recipient Info */}
          <View style={styles.recipientCard}>
            <View style={styles.recipientAvatar}>
              <Text style={styles.recipientAvatarText}>{selectedContact.avatar}</Text>
            </View>
            <Text style={styles.recipientName}>{selectedContact.name}</Text>
            <Text style={styles.recipientUpi}>{selectedContact.upiId}</Text>
          </View>

          {/* Amount Input */}
          <View style={styles.amountContainer}>
            <Text style={styles.currencySymbol}>₹</Text>
            <TextInput
              style={styles.amountInput}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              value={amount}
              onChangeText={setAmount}
              keyboardType="numeric"
              autoFocus
            />
          </View>
          <Text style={styles.balanceHint}>
            Available: ₹{balance.toLocaleString("en-IN")}
          </Text>

          {/* Quick Amounts */}
          <View style={styles.quickAmounts}>
            {QUICK_AMOUNTS.map((qa) => (
              <TouchableOpacity
                key={qa}
                style={styles.quickAmountBtn}
                onPress={() => {
                  setAmount(qa.toString());
                  Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
                }}
              >
                <Text style={styles.quickAmountText}>+₹{qa.toLocaleString("en-IN")}</Text>
              </TouchableOpacity>
            ))}
          </View>

          {/* Note */}
          <View style={styles.noteContainer}>
            <Ionicons name="chatbubble-outline" size={18} color={Colors.textSecondary} />
            <TextInput
              style={styles.noteInput}
              placeholder="Add a note (optional)"
              placeholderTextColor={Colors.textTertiary}
              value={note}
              onChangeText={setNote}
            />
          </View>

          {/* Send Button */}
          <TouchableOpacity
            style={[styles.sendBtn, !amount && styles.sendBtnDisabled]}
            onPress={handleSend}
            disabled={!amount}
            activeOpacity={0.85}
          >
            <Ionicons name="paper-plane" size={20} color="#fff" />
            <Text style={styles.sendBtnText}>
              {amount ? `Send ₹${parseFloat(amount).toLocaleString("en-IN")}` : "Enter Amount"}
            </Text>
          </TouchableOpacity>
        </ScrollView>
      )}

      {/* Success Step */}
      {step === "success" && (
        <View style={[styles.successContainer, { paddingBottom: bottomPadding + 20 }]}>
          <Animated.View style={[styles.successContent, { transform: [{ scale: successScale }] }]}>
            <View style={styles.successCheck}>
              <Ionicons name="checkmark" size={48} color="#fff" />
            </View>
            <Text style={styles.successTitle}>Money Sent!</Text>
            <Text style={styles.successAmount}>₹{parseFloat(amount).toLocaleString("en-IN")}</Text>
            <Text style={styles.successSub}>sent to {selectedContact?.name}</Text>
            <Text style={styles.successUpi}>{selectedContact?.upiId}</Text>

            <View style={styles.successDetail}>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Transaction ID</Text>
                <Text style={styles.successDetailValue}>TXN{Date.now().toString().slice(-8)}</Text>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Status</Text>
                <View style={styles.successBadge}>
                  <Ionicons name="checkmark-circle" size={13} color={Colors.success} />
                  <Text style={styles.successBadgeText}>Success</Text>
                </View>
              </View>
              <View style={styles.successDetailRow}>
                <Text style={styles.successDetailLabel}>Date & Time</Text>
                <Text style={styles.successDetailValue}>{new Date().toLocaleString("en-IN")}</Text>
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
  flex: { flex: 1 },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.border },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text },
  searchContainer: { padding: 16, backgroundColor: Colors.surface },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 11, gap: 10 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 15, color: Colors.text },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text, paddingHorizontal: 16, paddingTop: 16, paddingBottom: 10 },
  recentScroll: { paddingHorizontal: 16, gap: 16 },
  recentContact: { alignItems: "center", gap: 8, width: 64 },
  recentAvatar: { width: 52, height: 52, borderRadius: 26, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  recentAvatarText: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff" },
  recentName: { fontFamily: "Inter_500Medium", fontSize: 12, color: Colors.text, textAlign: "center" },
  contactList: { paddingHorizontal: 16, gap: 4 },
  contactItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, padding: 14, borderRadius: 14, gap: 12 },
  contactAvatar: { width: 46, height: 46, borderRadius: 23, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  contactAvatarText: { fontFamily: "Inter_700Bold", fontSize: 18, color: "#fff" },
  contactInfo: { flex: 1 },
  contactName: { fontFamily: "Inter_600SemiBold", fontSize: 15, color: Colors.text },
  contactUpi: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 2 },
  emptyState: { alignItems: "center", paddingVertical: 48, gap: 12 },
  emptyText: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.textSecondary },
  recipientCard: { alignItems: "center", paddingVertical: 28 },
  recipientAvatar: { width: 68, height: 68, borderRadius: 34, backgroundColor: Colors.primary, alignItems: "center", justifyContent: "center", marginBottom: 12 },
  recipientAvatarText: { fontFamily: "Inter_700Bold", fontSize: 26, color: "#fff" },
  recipientName: { fontFamily: "Inter_700Bold", fontSize: 20, color: Colors.text, marginBottom: 4 },
  recipientUpi: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  amountContainer: { flexDirection: "row", alignItems: "center", justifyContent: "center", paddingVertical: 8 },
  currencySymbol: { fontFamily: "Inter_700Bold", fontSize: 38, color: Colors.text, marginRight: 4 },
  amountInput: { fontFamily: "Inter_700Bold", fontSize: 48, color: Colors.text, minWidth: 120, textAlign: "center" },
  balanceHint: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary, textAlign: "center", marginBottom: 20 },
  quickAmounts: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 8, justifyContent: "center", marginBottom: 20 },
  quickAmountBtn: { borderWidth: 1.5, borderColor: Colors.primary, borderRadius: 20, paddingHorizontal: 14, paddingVertical: 7 },
  quickAmountText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.primary },
  noteContainer: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, marginHorizontal: 16, borderRadius: 14, paddingHorizontal: 14, paddingVertical: 12, gap: 10, marginBottom: 24 },
  noteInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.text },
  sendBtn: { marginHorizontal: 16, backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 17, flexDirection: "row", alignItems: "center", justifyContent: "center", gap: 10, shadowColor: Colors.primary, shadowOffset: { width: 0, height: 6 }, shadowOpacity: 0.35, shadowRadius: 12, elevation: 6 },
  sendBtnDisabled: { backgroundColor: Colors.textTertiary, shadowOpacity: 0 },
  sendBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  successContainer: { flex: 1, alignItems: "center", justifyContent: "space-between", padding: 24 },
  successContent: { alignItems: "center", flex: 1, justifyContent: "center", gap: 6 },
  successCheck: { width: 88, height: 88, borderRadius: 44, backgroundColor: Colors.success, alignItems: "center", justifyContent: "center", marginBottom: 16, shadowColor: Colors.success, shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.4, shadowRadius: 16, elevation: 8 },
  successTitle: { fontFamily: "Inter_700Bold", fontSize: 26, color: Colors.text },
  successAmount: { fontFamily: "Inter_700Bold", fontSize: 40, color: Colors.primary, marginTop: 4 },
  successSub: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.textSecondary },
  successUpi: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textTertiary },
  successDetail: { width: "100%", backgroundColor: Colors.surface, borderRadius: 18, padding: 18, gap: 12, marginTop: 20 },
  successDetailRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  successDetailLabel: { fontFamily: "Inter_400Regular", fontSize: 13, color: Colors.textSecondary },
  successDetailValue: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text },
  successBadge: { flexDirection: "row", alignItems: "center", gap: 4 },
  successBadgeText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.success },
  doneBtn: { width: "100%", backgroundColor: Colors.primary, borderRadius: 18, paddingVertical: 16, alignItems: "center", shadowColor: Colors.primary, shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 10, elevation: 5 },
  doneBtnText: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
