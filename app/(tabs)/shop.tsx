import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Platform,
  Dimensions,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import Colors from "@/constants/colors";
import { useApp } from "@/context/AppContext";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 48) / 2;

interface Product {
  id: string;
  name: string;
  section: string;
  price: number;
  originalPrice: number;
  unit: string;
  icon: keyof typeof Ionicons.glyphMap;
  color: string;
  bg: string;
  tag?: string;
}

const CATEGORIES = [
  { id: "dairy", label: "Dairy, Bread\n& Eggs", icon: "water-outline" as const, color: "#0077B6", bg: "#E0F4FF" },
  { id: "fruits", label: "Fruits &\nVegetables", icon: "leaf-outline" as const, color: "#27AE60", bg: "#E8F8EE" },
  { id: "drinks", label: "Cold Drinks\n& Juices", icon: "wine-outline" as const, color: "#E74C3C", bg: "#FFE8E6" },
  { id: "snacks", label: "Snacks &\nMunchies", icon: "fast-food-outline" as const, color: "#F39C12", bg: "#FFF3D6" },
  { id: "breakfast", label: "Breakfast &\nInstant Food", icon: "sunny-outline" as const, color: "#E67E22", bg: "#FFF0E0" },
  { id: "sweet", label: "Sweet\nTooth", icon: "heart-outline" as const, color: "#E91E8C", bg: "#FFE8F4" },
  { id: "bakery", label: "Bakery &\nBiscuits", icon: "cafe-outline" as const, color: "#795548", bg: "#F5EFE8" },
  { id: "tea", label: "Tea, Coffee\n& Milk", icon: "cafe" as const, color: "#5D4037", bg: "#EFEBE9" },
  { id: "atta", label: "Atta, Rice\n& Dal", icon: "nutrition-outline" as const, color: "#FF8F00", bg: "#FFF3E0" },
  { id: "masala", label: "Masala, Oil\n& More", icon: "flame-outline" as const, color: "#D84315", bg: "#FBE9E7" },
  { id: "chicken", label: "Chicken,\nMeat & Fish", icon: "restaurant-outline" as const, color: "#C62828", bg: "#FFEBEE" },
  { id: "organic", label: "Organic &\nHealthy", icon: "sparkles-outline" as const, color: "#2E7D32", bg: "#E8F5E9" },
  { id: "baby", label: "Baby\nCare", icon: "happy-outline" as const, color: "#7B1FA2", bg: "#F3E5F5" },
  { id: "pharma", label: "Pharma &\nWellness", icon: "medical-outline" as const, color: "#0277BD", bg: "#E1F5FE" },
  { id: "cleaning", label: "Cleaning\nEssentials", icon: "sparkles" as const, color: "#00838F", bg: "#E0F7FA" },
  { id: "home", label: "Home &\nOffice", icon: "home-outline" as const, color: "#37474F", bg: "#ECEFF1" },
  { id: "personal", label: "Personal\nCare", icon: "person-outline" as const, color: "#AD1457", bg: "#FCE4EC" },
  { id: "pet", label: "Pet\nCare", icon: "paw-outline" as const, color: "#4E342E", bg: "#EFEBE9" },
];

const SECTIONS: { id: string; title: string; products: Product[] }[] = [
  {
    id: "dairy",
    title: "Dairy, Bread & Eggs",
    products: [
      { id: "d1", name: "Amul Gold Milk", section: "dairy", price: 32, originalPrice: 35, unit: "500 ml", icon: "water-outline", color: "#0077B6", bg: "#E0F4FF", tag: "BESTSELLER" },
      { id: "d2", name: "Amul Taaza Toned", section: "dairy", price: 28, originalPrice: 30, unit: "500 ml", icon: "water-outline", color: "#0077B6", bg: "#E0F4FF" },
      { id: "d3", name: "Amul Butter", section: "dairy", price: 55, originalPrice: 60, unit: "100 g", icon: "nutrition-outline", color: "#F39C12", bg: "#FFF3D6", tag: "8% OFF" },
      { id: "d4", name: "Amul Salted Butter", section: "dairy", price: 55, originalPrice: 58, unit: "100 g", icon: "nutrition-outline", color: "#F39C12", bg: "#FFF3D6" },
      { id: "d5", name: "Farm Eggs", section: "dairy", price: 90, originalPrice: 99, unit: "12 pcs", icon: "ellipse-outline", color: "#795548", bg: "#F5EFE8" },
    ],
  },
  {
    id: "snacks",
    title: "Snacks & Munchies",
    products: [
      { id: "s1", name: "Lay's Classic", section: "snacks", price: 20, originalPrice: 20, unit: "26 g", icon: "fast-food-outline", color: "#F39C12", bg: "#FFF3D6" },
      { id: "s2", name: "Kurkure Masala", section: "snacks", price: 20, originalPrice: 20, unit: "90 g", icon: "fast-food-outline", color: "#E67E22", bg: "#FFF0E0", tag: "FAV" },
      { id: "s3", name: "Bingo Dark Fantasy", section: "snacks", price: 30, originalPrice: 35, unit: "75 g", icon: "fast-food-outline", color: "#5C35CC", bg: "#EDE8FF", tag: "14% OFF" },
      { id: "s4", name: "Haldirams Namkeen", section: "snacks", price: 40, originalPrice: 45, unit: "150 g", icon: "fast-food-outline", color: "#E67E22", bg: "#FFF0E0" },
      { id: "s5", name: "Protein Chips", section: "snacks", price: 99, originalPrice: 120, unit: "72 g", icon: "fast-food-outline", color: "#00C48C", bg: "#E0FFF5", tag: "17% OFF" },
    ],
  },
  {
    id: "drinks",
    title: "Cold Drinks & Juices",
    products: [
      { id: "c1", name: "Coca-Cola", section: "drinks", price: 40, originalPrice: 45, unit: "750 ml", icon: "wine-outline", color: "#E74C3C", bg: "#FFE8E6", tag: "11% OFF" },
      { id: "c2", name: "Amul Smoothie", section: "drinks", price: 35, originalPrice: 38, unit: "200 ml", icon: "wine-outline", color: "#00C48C", bg: "#E0FFF5" },
      { id: "c3", name: "Bisleri Water", section: "drinks", price: 20, originalPrice: 20, unit: "1 L", icon: "water-outline", color: "#0077B6", bg: "#E0F4FF" },
      { id: "c4", name: "Tropicana OJ", section: "drinks", price: 99, originalPrice: 110, unit: "1 L", icon: "wine-outline", color: "#E67E22", bg: "#FFF0E0", tag: "10% OFF" },
      { id: "c5", name: "Minute Maid", section: "drinks", price: 20, originalPrice: 20, unit: "200 ml", icon: "wine-outline", color: "#F39C12", bg: "#FFF3D6" },
    ],
  },
  {
    id: "pharma",
    title: "Pharma & Wellness",
    products: [
      { id: "ph1", name: "Dettol Soap", section: "pharma", price: 45, originalPrice: 50, unit: "75 g", icon: "medical-outline", color: "#27AE60", bg: "#E8F8EE", tag: "10% OFF" },
      { id: "ph2", name: "Disprin Tablet", section: "pharma", price: 15, originalPrice: 15, unit: "10 tabs", icon: "medical-outline", color: "#0277BD", bg: "#E1F5FE" },
      { id: "ph3", name: "Band-Aid", section: "pharma", price: 99, originalPrice: 110, unit: "10 strips", icon: "bandage-outline" as any, color: "#E74C3C", bg: "#FFE8E6" },
      { id: "ph4", name: "ENO Fruit Salt", section: "pharma", price: 25, originalPrice: 28, unit: "5 g x 6", icon: "medical-outline", color: "#00838F", bg: "#E0F7FA" },
    ],
  },
];

function formatCurrency(amount: number) {
  return `₹${amount}`;
}

function ProductCard({
  product,
  cart,
  onAdd,
  onRemove,
}: {
  product: Product;
  cart: { [id: string]: number };
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
}) {
  return (
    <View style={productStyles.card}>
      <View style={[productStyles.imageBox, { backgroundColor: product.bg }]}>
        <Ionicons name={product.icon} size={38} color={product.color} />
        {product.tag && (
          <View style={productStyles.tag}>
            <Text style={productStyles.tagText}>{product.tag}</Text>
          </View>
        )}
        <View style={productStyles.deliveryPill}>
          <Ionicons name="flash" size={9} color={Colors.orange} />
          <Text style={productStyles.deliveryText}>8 min</Text>
        </View>
      </View>
      <Text style={productStyles.name} numberOfLines={2}>{product.name}</Text>
      <Text style={productStyles.unit}>{product.unit}</Text>
      <View style={productStyles.bottom}>
        <View>
          <Text style={productStyles.price}>{formatCurrency(product.price)}</Text>
          {product.originalPrice > product.price && (
            <Text style={productStyles.originalPrice}>{formatCurrency(product.originalPrice)}</Text>
          )}
        </View>
        {cart[product.id] ? (
          <View style={productStyles.qtyRow}>
            <TouchableOpacity style={productStyles.qtyBtn} onPress={() => onRemove(product.id)}>
              <Ionicons name="remove" size={13} color={Colors.primary} />
            </TouchableOpacity>
            <Text style={productStyles.qtyNum}>{cart[product.id]}</Text>
            <TouchableOpacity style={[productStyles.qtyBtn, productStyles.qtyBtnFill]} onPress={() => onAdd(product.id)}>
              <Ionicons name="add" size={13} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={productStyles.addBtn} onPress={() => onAdd(product.id)}>
            <Ionicons name="add" size={18} color={Colors.primary} />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const productStyles = StyleSheet.create({
  card: { width: 148, backgroundColor: "#fff", borderRadius: 14, padding: 10, marginRight: 10 },
  tag: { position: "absolute", top: 6, left: 6, backgroundColor: Colors.primary, borderRadius: 5, paddingHorizontal: 6, paddingVertical: 2, zIndex: 1 },
  tagText: { fontFamily: "Inter_700Bold", fontSize: 8, color: "#fff", letterSpacing: 0.4 },
  imageBox: { width: "100%", height: 88, borderRadius: 10, alignItems: "center", justifyContent: "center", marginBottom: 8, position: "relative" },
  deliveryPill: { position: "absolute", bottom: 5, left: 6, flexDirection: "row", alignItems: "center", gap: 2, backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 5, paddingVertical: 2 },
  deliveryText: { fontFamily: "Inter_700Bold", fontSize: 9, color: Colors.orange },
  name: { fontFamily: "Inter_600SemiBold", fontSize: 12.5, color: Colors.text, lineHeight: 17, marginBottom: 2 },
  unit: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.textSecondary, marginBottom: 8 },
  bottom: { flexDirection: "row", justifyContent: "space-between", alignItems: "center" },
  price: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.text },
  originalPrice: { fontFamily: "Inter_400Regular", fontSize: 10, color: Colors.textTertiary, textDecorationLine: "line-through" },
  addBtn: { width: 30, height: 30, borderRadius: 8, borderWidth: 1.5, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  qtyRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  qtyBtn: { width: 26, height: 26, borderRadius: 7, borderWidth: 1.5, borderColor: Colors.primary, alignItems: "center", justifyContent: "center" },
  qtyBtnFill: { backgroundColor: Colors.primary, borderColor: Colors.primary },
  qtyNum: { fontFamily: "Inter_700Bold", fontSize: 13, color: Colors.text, minWidth: 16, textAlign: "center" },
});

export default function ShopScreen() {
  const insets = useSafeAreaInsets();
  const { addTransaction } = useApp();
  const [search, setSearch] = useState("");
  const [cart, setCart] = useState<{ [id: string]: number }>({});

  const topPadding = Platform.OS === "web" ? 67 : insets.top;

  const allProducts = SECTIONS.flatMap((s) => s.products);
  const cartCount = Object.values(cart).reduce((a, b) => a + b, 0);
  const cartTotal = allProducts.reduce((total, p) => total + (cart[p.id] || 0) * p.price, 0);

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
        title: "Quick Commerce Order",
        subtitle: `${cartCount} items • Essentials`,
        amount: -cartTotal,
        icon: "bag",
        color: Colors.orange,
        status: "success",
      });
      setCart({});
    }
  };

  const isSearching = search.length > 0;
  const searchResults = allProducts.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <View style={styles.container}>
      {/* Sticky Header */}
      <View style={[styles.header, { paddingTop: topPadding + 10 }]}>
        <View style={styles.headerRow}>
          <View style={styles.locationBlock}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={13} color={Colors.orange} />
              <Text style={styles.locationLabel}>Deliver to Home</Text>
              <Ionicons name="chevron-down" size={13} color={Colors.textSecondary} />
            </View>
            <Text style={styles.deliveryTime}>Delivery in 8 minutes</Text>
          </View>
          {cartCount > 0 && (
            <TouchableOpacity style={styles.cartIconBtn} onPress={checkout} activeOpacity={0.85}>
              <Ionicons name="bag" size={19} color="#fff" />
              <View style={styles.cartBadge}>
                <Text style={styles.cartBadgeText}>{cartCount}</Text>
              </View>
            </TouchableOpacity>
          )}
        </View>
        <View style={styles.searchBar}>
          <Ionicons name="search-outline" size={17} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search groceries, essentials..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch("")}>
              <Ionicons name="close-circle" size={17} color={Colors.textTertiary} />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: Platform.OS === "web" ? 84 + 34 : 110 }}>

        {/* ── SEARCH RESULTS ── */}
        {isSearching ? (
          <View style={{ padding: 16 }}>
            <Text style={styles.sectionTitle}>Results for "{search}"</Text>
            {searchResults.length === 0 ? (
              <View style={styles.emptySearch}>
                <Ionicons name="search-outline" size={44} color={Colors.textTertiary} />
                <Text style={styles.emptySearchText}>No products found</Text>
              </View>
            ) : (
              <View style={styles.searchGrid}>
                {searchResults.map((p) => (
                  <ProductCard key={p.id} product={p} cart={cart} onAdd={addToCart} onRemove={removeFromCart} />
                ))}
              </View>
            )}
          </View>
        ) : (
          <>
            {/* ── HERO BANNER ── */}
            <LinearGradient
              colors={["#1B6B2C", "#2E9A45", "#47C264"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.heroBanner}
            >
              <View style={styles.heroLeft}>
                <Text style={styles.heroTitle}>Stock up on{"\n"}daily essentials</Text>
                <Text style={styles.heroSub}>Get farm-fresh goodness & exotic fruits, vegetables, eggs & more</Text>
                <TouchableOpacity style={styles.heroBtn} activeOpacity={0.85}>
                  <Text style={styles.heroBtnText}>Shop Now</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.heroRight}>
                <View style={styles.heroIconsGrid}>
                  {[
                    { icon: "leaf", color: "#27AE60" },
                    { icon: "nutrition-outline", color: "#F39C12" },
                    { icon: "water-outline", color: "#0077B6" },
                    { icon: "wine-outline", color: "#E74C3C" },
                  ].map((item, i) => (
                    <View key={i} style={[styles.heroIconBubble, { backgroundColor: "rgba(255,255,255,0.25)" }]}>
                      <Ionicons name={item.icon as keyof typeof Ionicons.glyphMap} size={22} color="#fff" />
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>

            {/* ── 3 MINI PROMO CARDS ── */}
            <View style={styles.miniPromoRow}>
              <LinearGradient colors={["#00BCD4", "#00838F"]} style={styles.miniPromo}>
                <View style={styles.miniPromoInner}>
                  <Text style={styles.miniPromoTitle}>Pharmacy{"\n"}at your door</Text>
                  <Text style={styles.miniPromoSub}>Cough syrups, pain{"\n"}relief sprays & more</Text>
                  <TouchableOpacity style={styles.miniPromoBtn}>
                    <Text style={styles.miniPromoBtnText}>Order Now</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.miniPromoIcon}>
                  <Ionicons name="medical" size={44} color="rgba(255,255,255,0.35)" />
                </View>
              </LinearGradient>

              <LinearGradient colors={["#FFC107", "#FF8F00"]} style={styles.miniPromo}>
                <View style={styles.miniPromoInner}>
                  <Text style={styles.miniPromoTitle}>Pet care{"\n"}at your door</Text>
                  <Text style={styles.miniPromoSub}>Food, treats,{"\n"}toys & more</Text>
                  <TouchableOpacity style={styles.miniPromoBtn}>
                    <Text style={[styles.miniPromoBtnText, { color: "#5D4037" }]}>Order Now</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.miniPromoIcon}>
                  <Ionicons name="paw" size={44} color="rgba(255,255,255,0.35)" />
                </View>
              </LinearGradient>

              <LinearGradient colors={["#9C27B0", "#6A1B9A"]} style={styles.miniPromo}>
                <View style={styles.miniPromoInner}>
                  <Text style={styles.miniPromoTitle}>No time for{"\n"}a diaper run?</Text>
                  <Text style={styles.miniPromoSub}>Get baby care{"\n"}essentials</Text>
                  <TouchableOpacity style={styles.miniPromoBtn}>
                    <Text style={styles.miniPromoBtnText}>Order Now</Text>
                  </TouchableOpacity>
                </View>
                <View style={styles.miniPromoIcon}>
                  <Ionicons name="happy" size={44} color="rgba(255,255,255,0.35)" />
                </View>
              </LinearGradient>
            </View>

            {/* ── CATEGORY GRID (2 rows, horizontal scroll) ── */}
            <View style={styles.categorySection}>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryScroll}
              >
                {/* Row 1 */}
                <View style={styles.categoryColumn}>
                  {CATEGORIES.slice(0, 9).map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryItem}
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Ionicons name={cat.icon} size={22} color={cat.color} />
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
                {/* Row 2 */}
                <View style={styles.categoryColumn}>
                  {CATEGORIES.slice(9).map((cat) => (
                    <TouchableOpacity
                      key={cat.id}
                      style={styles.categoryItem}
                      onPress={() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light)}
                      activeOpacity={0.75}
                    >
                      <View style={[styles.categoryIcon, { backgroundColor: cat.bg }]}>
                        <Ionicons name={cat.icon} size={22} color={cat.color} />
                      </View>
                      <Text style={styles.categoryLabel}>{cat.label}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </ScrollView>
            </View>

            {/* ── PRODUCT SECTIONS ── */}
            {SECTIONS.map((section) => (
              <View key={section.id} style={styles.productSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>{section.title}</Text>
                  <TouchableOpacity style={styles.seeAllBtn}>
                    <Text style={styles.seeAllText}>See all</Text>
                    <Ionicons name="chevron-forward" size={13} color={Colors.primary} />
                  </TouchableOpacity>
                </View>
                <ScrollView
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.productsScroll}
                >
                  {section.products.map((product) => (
                    <ProductCard
                      key={product.id}
                      product={product}
                      cart={cart}
                      onAdd={addToCart}
                      onRemove={removeFromCart}
                    />
                  ))}
                </ScrollView>
              </View>
            ))}
          </>
        )}
      </ScrollView>

      {/* Cart Bar */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={[styles.cartBar, { bottom: Platform.OS === "web" ? 84 + 16 : insets.bottom + 78 }]}
          onPress={checkout}
          activeOpacity={0.92}
        >
          <LinearGradient
            colors={[Colors.orange, "#FF8C55"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.cartBarInner}
          >
            <View style={styles.cartBarLeft}>
              <View style={styles.cartBarBadge}>
                <Text style={styles.cartBarBadgeText}>{cartCount}</Text>
              </View>
              <Text style={styles.cartBarLabel}>items in cart</Text>
            </View>
            <View style={styles.cartBarRight}>
              <Text style={styles.cartBarTotal}>{formatCurrency(cartTotal)}</Text>
              <View style={styles.cartBarArrow}>
                <Ionicons name="arrow-forward" size={14} color={Colors.orange} />
              </View>
            </View>
          </LinearGradient>
        </TouchableOpacity>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#F5F5F5" },

  // Header
  header: { backgroundColor: "#fff", paddingHorizontal: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: "#EFEFEF" },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 },
  locationBlock: {},
  locationRow: { flexDirection: "row", alignItems: "center", gap: 4 },
  locationLabel: { fontFamily: "Inter_700Bold", fontSize: 14, color: Colors.text },
  deliveryTime: { fontFamily: "Inter_400Regular", fontSize: 11, color: Colors.orange, marginTop: 2 },
  cartIconBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.orange, alignItems: "center", justifyContent: "center" },
  cartBadge: { position: "absolute", top: -3, right: -3, backgroundColor: Colors.primary, borderRadius: 7, minWidth: 14, height: 14, alignItems: "center", justifyContent: "center", paddingHorizontal: 2 },
  cartBadgeText: { fontFamily: "Inter_700Bold", fontSize: 8, color: "#fff" },
  searchBar: { flexDirection: "row", alignItems: "center", backgroundColor: "#F5F5F5", borderRadius: 12, paddingHorizontal: 12, paddingVertical: 9, gap: 8, borderWidth: 1, borderColor: "#E8E8E8" },
  searchInput: { flex: 1, fontFamily: "Inter_400Regular", fontSize: 14, color: Colors.text },

  // Hero Banner
  heroBanner: { marginHorizontal: 14, marginTop: 14, borderRadius: 18, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20, paddingLeft: 18, paddingRight: 10, overflow: "hidden" },
  heroLeft: { flex: 1 },
  heroTitle: { fontFamily: "Inter_700Bold", fontSize: 20, color: "#fff", lineHeight: 26, marginBottom: 7 },
  heroSub: { fontFamily: "Inter_400Regular", fontSize: 12, color: "rgba(255,255,255,0.82)", lineHeight: 17, marginBottom: 14 },
  heroBtn: { backgroundColor: "#fff", borderRadius: 8, paddingHorizontal: 16, paddingVertical: 8, alignSelf: "flex-start" },
  heroBtnText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#1B6B2C" },
  heroRight: { paddingLeft: 10 },
  heroIconsGrid: { flexWrap: "wrap", flexDirection: "row", width: 96, gap: 8 },
  heroIconBubble: { width: 42, height: 42, borderRadius: 12, alignItems: "center", justifyContent: "center" },

  // Mini Promos
  miniPromoRow: { flexDirection: "row", paddingHorizontal: 14, paddingTop: 12, gap: 8 },
  miniPromo: { flex: 1, borderRadius: 14, paddingTop: 12, paddingHorizontal: 10, paddingBottom: 12, overflow: "hidden", minHeight: 130 },
  miniPromoInner: { gap: 3 },
  miniPromoTitle: { fontFamily: "Inter_700Bold", fontSize: 12, color: "#fff", lineHeight: 16 },
  miniPromoSub: { fontFamily: "Inter_400Regular", fontSize: 9.5, color: "rgba(255,255,255,0.8)", lineHeight: 14, marginBottom: 8 },
  miniPromoBtn: { backgroundColor: "rgba(255,255,255,0.25)", borderRadius: 16, paddingHorizontal: 8, paddingVertical: 4, alignSelf: "flex-start" },
  miniPromoBtnText: { fontFamily: "Inter_600SemiBold", fontSize: 10, color: "#fff" },
  miniPromoIcon: { position: "absolute", right: -8, bottom: -8 },

  // Categories
  categorySection: { marginTop: 14, backgroundColor: "#fff", paddingVertical: 14, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EFEFEF" },
  categoryScroll: { paddingHorizontal: 14, flexDirection: "column", gap: 4 },
  categoryColumn: { flexDirection: "row", gap: 4 },
  categoryItem: { width: 72, alignItems: "center", gap: 6 },
  categoryIcon: { width: 60, height: 60, borderRadius: 14, alignItems: "center", justifyContent: "center" },
  categoryLabel: { fontFamily: "Inter_500Medium", fontSize: 10, color: Colors.text, textAlign: "center", lineHeight: 13 },

  // Product Sections
  productSection: { marginTop: 14, backgroundColor: "#fff", paddingTop: 14, paddingBottom: 4, borderTopWidth: 1, borderBottomWidth: 1, borderColor: "#EFEFEF" },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingHorizontal: 14, marginBottom: 12 },
  sectionTitle: { fontFamily: "Inter_700Bold", fontSize: 16, color: Colors.text },
  seeAllBtn: { flexDirection: "row", alignItems: "center", gap: 2 },
  seeAllText: { fontFamily: "Inter_600SemiBold", fontSize: 13, color: Colors.primary },
  productsScroll: { paddingHorizontal: 14, paddingBottom: 12 },

  // Search
  emptySearch: { alignItems: "center", paddingVertical: 60, gap: 12 },
  emptySearchText: { fontFamily: "Inter_500Medium", fontSize: 15, color: Colors.textSecondary },
  searchGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },

  // Cart Bar
  cartBar: { position: "absolute", left: 14, right: 14 },
  cartBarInner: { borderRadius: 16, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16, paddingVertical: 13 },
  cartBarLeft: { flexDirection: "row", alignItems: "center", gap: 10 },
  cartBarBadge: { backgroundColor: "rgba(255,255,255,0.28)", borderRadius: 7, width: 26, height: 26, alignItems: "center", justifyContent: "center" },
  cartBarBadgeText: { fontFamily: "Inter_700Bold", fontSize: 13, color: "#fff" },
  cartBarLabel: { fontFamily: "Inter_500Medium", fontSize: 14, color: "#fff" },
  cartBarRight: { flexDirection: "row", alignItems: "center", gap: 8 },
  cartBarTotal: { fontFamily: "Inter_700Bold", fontSize: 16, color: "#fff" },
  cartBarArrow: { width: 28, height: 28, borderRadius: 8, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" },
});
