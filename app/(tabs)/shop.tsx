import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  originalPrice: number;
  unit: string;
  icon: string;
  color: string;
  tag?: string;
  deliveryTime: string;
}

const CATEGORIES = [
  { id: "all", label: "All", icon: "grid-outline" as const },
  { id: "dairy", label: "Dairy", icon: "water-outline" as const },
  { id: "fruits", label: "Fruits", icon: "leaf-outline" as const },
  { id: "snacks", label: "Snacks", icon: "fast-food-outline" as const },
  { id: "drinks", label: "Drinks", icon: "wine-outline" as const },
  { id: "pharmacy", label: "Pharma", icon: "medical-outline" as const },
];

const PRODUCTS: Product[] = [
  { id: "p1", name: "Amul Gold Milk", category: "dairy", price: 32, originalPrice: 35, unit: "500 ml", icon: "water", color: "#0077B6", tag: "BESTSELLER", deliveryTime: "8 min" },
  { id: "p2", name: "Britannia Bread", category: "snacks", price: 49, originalPrice: 55, unit: "400 g", icon: "fast-food", color: "#E67E22", tag: "11% OFF", deliveryTime: "10 min" },
  { id: "p3", name: "Lay's Classic", category: "snacks", price: 20, originalPrice: 20, unit: "26 g", icon: "fast-food", color: "#F1C40F", deliveryTime: "8 min" },
  { id: "p4", name: "Coca-Cola", category: "drinks", price: 40, originalPrice: 45, unit: "750 ml", icon: "wine", color: "#E74C3C", tag: "11% OFF", deliveryTime: "8 min" },
  { id: "p5", name: "Amul Butter", category: "dairy", price: 55, originalPrice: 60, unit: "100 g", icon: "water", color: "#F39C12", deliveryTime: "8 min" },
  { id: "p6", name: "Banana", category: "fruits", price: 49, originalPrice: 55, unit: "6 pcs", icon: "leaf", color: "#F1C40F", tag: "Fresh", deliveryTime: "10 min" },
  { id: "p7", name: "Dettol Soap", category: "pharmacy", price: 45, originalPrice: 50, unit: "75 g", icon: "medical", color: "#27AE60", deliveryTime: "8 min" },
  { id: "p8", name: "Tropicana OJ", category: "drinks", price: 99, originalPrice: 110, unit: "1 L", icon: "wine", color: "#E67E22", tag: "10% OFF", deliveryTime: "10 min" },
];

function formatCurrency(amount: number) {
  return `₹${amount}`;
}

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { addTransaction } = useApp();
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const filtered = PRODUCTS.filter((p) => {
    const matchCat = selectedCategory === "all" || p.category === selectedCategory;
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = PRODUCTS.reduce((total, p) => total + (cart[p.id] || 0) * p.price, 0);

  const addToCart = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCart((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const removeFromCart = (id: string) => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    setCart((prev) => {
      const next = { ...prev };
      if (next[id] > 1) next[id]--;
      else delete next[id];
      return next;
    });
  };

  const checkout = () => {
    if (cartTotal > 0) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      addTransaction({
        type: "purchase",
        title: "Blinkit Order",
        subtitle: `${cartCount} items • Groceries`,
        amount: -cartTotal,
        icon: "bag",
        color: Colors.orange,
        status: "success",
      });
      setCart({});
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: topPadding + 12 }]}>
        <View style={styles.headerTop}>
          <View>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={Colors.orange} />
              <Text style={styles.locationText}>Deliver to Home</Text>
              <Ionicons name="chevron-down" size={14} color={Colors.textSecondary} />
            </View>
            <Text style={styles.deliveryBadge}>Delivery in 8 minutes</Text>
          </View>
          {cartCount > 0 && (
            <TouchableOpacity style={styles.cartBtn} onPress={checkout}>
              <Ionicons name="bag" size={20} color="#fff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        {/* Search */}
        <View style={styles.searchBar}>
          <Ionicons name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search for groceries, essentials..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={18} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 + 34 : 100 }}>
        {/* Categories */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categories}
        >
          {CATEGORIES.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[styles.categoryChip, selectedCategory === cat.id && styles.categoryChipActive]}
              onPress={() => setSelectedCategory(cat.id)}
            >
              <Ionicons
                name={cat.icon}
                size={16}
                color={selectedCategory === cat.id ? "#fff" : Colors.textSecondary}
              />
              <Text style={[styles.categoryLabel, selectedCategory === cat.id && styles.categoryLabelActive]}>
                {cat.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Promo Banner */}
        {selectedCategory === "all" && (
          <LinearGradient
            colors={["#FF6B35", "#FF8F60"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.promoBanner}
          >
            <View>
              <Text style={styles.promoTitle}>Stock up on daily essentials</Text>
              <Text style={styles.promoSub}>Farm-fresh groceries delivered fast</Text>
              <View style={styles.promoBtn}>
                <Text style={styles.promoBtnText}>Shop Now</Text>
              </View>
            </View>
            <View style={styles.promoIconContainer}>
              <Ionicons name="basket" size={64} color="rgba(255,255,255,0.3)" />
            </View>
          </LinearGradient>
        )}

        {/* Products */}
        <View style={styles.productsGrid}>
          {filtered.map((product) => (
            <View key={product.id} style={styles.productCard}>
              {product.tag && (
                <View style={[styles.productTag, { backgroundColor: Colors.primary }]}>
                  <Text style={styles.productTagText}>{product.tag}</Text>
                </View>
              )}
              <View style={[styles.productImageContainer, { backgroundColor: product.color + "18" }]}>
                <Ionicons name={product.icon as keyof typeof Ionicons.glyphMap} size={40} color={product.color} />
              </View>
              <Text style={styles.productDelivery}>
                <Ionicons name="flash" size={10} color={Colors.orange} /> {product.deliveryTime}
              </Text>
              <Text style={styles.productName} numberOfLines={2}>{product.name}</Text>
              <Text style={styles.productUnit}>{product.unit}</Text>
              <View style={styles.productBottom}>
                <View>
                  <Text style={styles.productPrice}>{formatCurrency(product.price)}</Text>
                  {product.originalPrice > product.price && (
                    <Text style={styles.productOriginalPrice}>{formatCurrency(product.originalPrice)}</Text>
                  )}
                </View>
                {cart[product.id] ? (
                  <View style={styles.quantityControl}>
                    <TouchableOpacity style={styles.qtyBtn} onPress={() => removeFromCart(product.id)}>
                      <Ionicons name="remove" size={14} color={Colors.primary} />
                    </TouchableOpacity>
                    <Text style={styles.qtyText}>{cart[product.id]}</Text>
                    <TouchableOpacity style={[styles.qtyBtn, styles.qtyBtnFilled]} onPress={() => addToCart(product.id)}>
                      <Ionicons name="add" size={14} color="#fff" />
                    </TouchableOpacity>
                  </View>
                ) : (
                  <TouchableOpacity style={styles.addBtn} onPress={() => addToCart(product.id)}>
                    <Ionicons name="add" size={18} color={Colors.primary} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Cart Footer */}
      {cartCount > 0 && (
        <TouchableOpacity style={[styles.cartFooter, { bottom: Platform.OS === "web" ? 84 + 16 : insets.bottom + 80 }]} onPress={checkout} activeOpacity={0.9}>
          <LinearGradient colors={[Colors.orange, "#FF8F60"]} start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }} style={styles.cartFooterInner}>
            <View style={styles.cartFooterLeft}>
              <View style={styles.cartCountBadge}>
                <Text style={styles.cartCountText}>{cartCount}</Text>
              </View>
              <Text style={styles.cartFooterText}>items in cart</Text>
            </View>
            <View style={styles.cartFooterRight}>
              <Text style={styles.cartFooterTotal}>{formatCurrency(cartTotal)}</Text>
              <Ionicons name="arrow-forward" size={16} color="#fff" />
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: { backgroundColor: Colors.surface, paddingHorizontal: 16, paddingBottom: 14, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 3 },
  headerTop: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 12 },
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationText: { fontFamily: "Inter_600SemiBold", fontSize: 14, color: Colors.text },
  deliveryBadge: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.orange, marginTop: 2 },
  cartBtn: { width: 42, height: 42, borderRadius: 21, backgroundColor: Colors.orange, alignItems: "center", justifyContent: "center" },
  cartBadge: { position: "absolute", top: -4, right: -4, backgroundColor: Colors.primary, borderRadius: 8, minWidth: 16, height: 16, alignItems: "center", justifyContent: "center", paddingHorizontal: 3 },
  cartBadgeText: { fontFamily: "Inter_700Bold", fontSize: 9, color: "#fff" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: Colors.background, borderRadius: 12, paddingHorizontal: 12, paddingVertical: 10, gap: 8 },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.text },
  categories: { paddingHorizontal: 16, paddingVertical: 14, gap: 8 },
  categoryChip: { flexDirection: "row", alignItems: "center", gap: 6, paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: Colors.surface, borderWidth: 1.5, borderColor: Colors.border },
  categoryChipActive: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  categoryLabel: { fontFamily: "Inter_500Medium", fontSize: 13, color: Colors.textSecondary },
  categoryLabelActive: { color: "#fff" },
  promoBanner: { marginHorizontal: 16, borderRadius: 18, padding: 20, flexDirection: "row", justifyContent: "space-between", alignItems: "center", overflow: "hidden", marginBottom: 8 },
  promoTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff", marginBottom: 4 },
  promoSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.8)", marginBottom: 12 },
  promoBtn: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 20, paddingHorizontal: 14, paddingVertical: 6, alignSelf: "flex-start" },
  promoBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: "#fff" },
  promoIconContainer: { position: "absolute", right: -10, bottom: -10, opacity: 0.5 },
  productsGrid: { flexDirection: "row", flexWrap: "wrap", paddingHorizontal: 16, gap: 10, paddingTop: 8 },
  productCard: { width: (width - 42) / 2, backgroundColor: Colors.surface, borderRadius: 16, padding: 12, shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 6, elevation: 2 },
  productTag: { alignSelf: "flex-start", borderRadius: 6, paddingHorizontal: 6, paddingVertical: 2, marginBottom: 8 },
  productTagText: { fontFamily: "Inter_600SemiBold", fontSize: 9, color: "#fff" },
  productImageContainer: { width: "100%", height: 90, borderRadius: 12, alignItems: "center", justifyContent: "center", marginBottom: 8 },
  productDelivery: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.orange, marginBottom: 4 },
  productName: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.text, marginBottom: 2, lineHeight: 18 },
  productUnit: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginBottom: 8 },
  productBottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  productPrice: { fontFamily: "Inter_700Bold", fontSize: 15, color: Colors.text },
  productOriginalPrice: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textTertiary, textDecorationLine: "line-through" },
  addBtn: { width: 32, height: 32, borderRadius: 10, borderWidth: 1.5, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  quantityControl: { flexDirection: "row", alignItems: "center", gap: 6 },
  qtyBtn: { width: 28, height: 28, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  qtyBtnFilled: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  qtyText: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.text, minWidth: 20, textAlign: "center" },
  cartFooter: { position: "absolute", left: 16, right: 16 },
  cartFooterInner: { borderRadius: 18, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 18, paddingVertical: 14 },
  cartFooterLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartCountBadge: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 8, width: 26, height: 26, alignItems: "center", justifyContent: "center" },
  cartCountText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#fff" },
  cartFooterText: { fontFamily: "Inter_500Medium", fontSize: 14, color: "#fff" },
  cartFooterRight: { flexDirection: "row", alignItems: "center", gap: 6 },
  cartFooterTotal: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
});
