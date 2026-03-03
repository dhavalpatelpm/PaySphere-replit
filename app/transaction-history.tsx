import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const FILTERS = ["All", "Sent", "Received", "Bills", "Shopping"] as const;
type Filter = typeof FILTERS[number];

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function formatTime(dateStr: string) {
  const date = new Date(dateStr);
  return date.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" });
}

export default function TransactionHistoryScreen() {
  const insets = useSafeAreaInsets();
  const { transactions } = useApp();
  const [filter, setFilter] = useState<Filter>("All");

  const topPadding = Platform.OS === "web" ? 67 : insets.top;
  const bottomPadding = Platform.OS === "web" ? 34 : insets.bottom;

  const filtered = transactions.filter((tx) => {
    if (filter === "All") return true;
    if (filter === "Sent") return tx.type === "sent";
    if (filter === "Received") return tx.type === "received";
    if (filter === "Bills") return tx.type === "bill" || tx.type === "recharge";
    if (filter === "Shopping") return tx.type === "purchase";
    return true;
  });

  const totalIncome = filtered.filter((t) => t.amount > 0).reduce((a, t) => a + t.amount, 0);
  const totalExpense = filtered.filter((t) => t.amount < 0).reduce((a, t) => a + Math.abs(t.amount), 0);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={Colors.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>All Transactions</Text>
        <TouchableOpacity style={styles.filterBtn}>
          <Ionicons name="options-outline" size={22} color={Colors.text} />
        </TouchableOpacity>
      </View>

      {/* Summary */}
      <View style={styles.summary}>
        <View style={styles.summaryStat}>
          <View style={styles.summaryIcon}>
            <Ionicons name="arrow-down" size={14} color={Colors.success} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Income</Text>
            <Text style={[styles.summaryValue, { color: Colors.success }]}>{formatCurrency(totalIncome)}</Text>
          </View>
        </View>
        <View style={styles.summaryDivider} />
        <View style={styles.summaryStat}>
          <View style={[styles.summaryIcon, { backgroundColor: Colors.error + "15" }]}>
            <Ionicons name="arrow-up" size={14} color={Colors.error} />
          </View>
          <View>
            <Text style={styles.summaryLabel}>Expense</Text>
            <Text style={[styles.summaryValue, { color: Colors.error }]}>{formatCurrency(totalExpense)}</Text>
          </View>
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersContainer}>
        {FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterChip, filter === f && styles.filterChipActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterChipText, filter === f && styles.filterChipTextActive]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Transaction List */}
      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: bottomPadding + 24, paddingTop: 8, gap: 6 }}
        showsVerticalScrollIndicator={false}
        scrollEnabled={!!filtered.length}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="receipt-outline" size={52} color={Colors.textTertiary} />
            <Text style={styles.emptyTitle}>No transactions</Text>
            <Text style={styles.emptyText}>Transactions will appear here</Text>
          </View>
        )}
        renderItem={({ item: tx }) => (
          <TouchableOpacity style={styles.txnItem} activeOpacity={0.7}>
            <View style={[styles.txnIcon, { backgroundColor: tx.color + "20" }]}>
              <Ionicons name={tx.icon as keyof typeof Ionicons.glyphMap} size={20} color={tx.color} />
            </View>
            <View style={styles.txnInfo}>
              <Text style={styles.txnTitle}>{tx.title}</Text>
              <Text style={styles.txnSub}>{tx.subtitle}</Text>
              <Text style={styles.txnDate}>{formatDate(tx.date)} • {formatTime(tx.date)}</Text>
            </View>
            <View style={styles.txnRight}>
              <Text
                style={[
                  styles.txnAmount,
                  { color: tx.amount > 0 ? Colors.success : Colors.text },
                ]}
              >
                {tx.amount > 0 ? "+" : "-"}{formatCurrency(tx.amount)}
              </Text>
              <View style={[styles.statusBadge, { backgroundColor: tx.status === "success" ? Colors.success + "18" : Colors.warning + "18" }]}>
                <Text style={[styles.statusText, { color: tx.status === "success" ? Colors.success : Colors.warning }]}>
                  {tx.status === "success" ? "Done" : "Pending"}
                </Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingBottom: 14, backgroundColor: Colors.surface },
  backBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  headerTitle: { fontFamily: "Inter_700Bold", fontSize: 17, color: Colors.text },
  filterBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.background, alignItems: "center", justifyContent: "center" },
  summary: { flexDirection: "row", backgroundColor: Colors.surface, marginHorizontal: 16, marginTop: 12, borderRadius: 18, padding: 16, alignItems: "center" },
  summaryStat: { flex: 1, flexDirection: "row", alignItems: "center", gap: 10 },
  summaryIcon: { width: 32, height: 32, borderRadius: 10, backgroundColor: Colors.success + "15", alignItems: "center", justifyContent: "center" },
  summaryLabel: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginBottom: 2 },
  summaryValue: { fontFamily: "Inter_700Bold", fontSize: 16 },
  summaryDivider: { width: 1, height: 36, backgroundColor: Colors.border, marginHorizontal: 10 },
  filtersContainer: { flexDirection: "row", paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  filterChip: { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  filterChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  filterChipText: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  filterChipTextActive: { color: "#fff" },
  txnItem: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.surface, padding: 14, borderRadius: 16, gap: 12 },
  txnIcon: { width: 46, height: 46, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  txnInfo: { flex: 1 },
  txnTitle: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  txnSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: Colors.textSecondary, marginTop: 1 },
  txnDate: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textTertiary, marginTop: 2 },
  txnRight: { alignItems: "flex-end", gap: 5 },
  txnAmount: { fontFamily: "Inter_700Bold", fontSize: 14 },
  statusBadge: { borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  statusText: { fontFamily: "Inter_600SemiBold", fontSize: 10 },
  emptyState: { alignItems: "center", paddingVertical: 64, gap: 10 },
  emptyTitle: { fontFamily: "Inter_700Bold", fontSize: 18, color: Colors.text },
  emptyText: { fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.textSecondary },
});
