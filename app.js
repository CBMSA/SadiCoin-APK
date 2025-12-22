import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Pressable,
  ActivityIndicator,
  ScrollView
} from "react-native";

/* ================== CONFIG ================== */
const SDC_CONTRACT = "0x3e6dB8977261B30Ea3Cc0408867912E8B6CeDC96";
const POLYGON_NETWORK = "Polygon (PoS)";
const PAIR_URL =
  "https://api.dexscreener.com/latest/dex/pairs/polygon/0xb298eff7ddc6385cdb5494a7315fd11a5fe461c1";

/* ================== APP ================== */
export default function App() {
  const [screen, setScreen] = useState("login");
  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(false);

  // Prototype wallet placeholders
  const wallet = {
    address: "0xYourWalletAddressHere",
    balance: "0.00 SDC",
    network: POLYGON_NETWORK
  };

  useEffect(() => {
    if (screen === "home") {
      fetchPrice();
    }
  }, [screen]);

  const fetchPrice = async () => {
    try {
      setLoading(true);
      const res = await fetch(PAIR_URL);
      const data = await res.json();
      setPrice(data?.pair?.priceUsd || "N/A");
    } catch {
      setPrice("Unavailable");
    } finally {
      setLoading(false);
    }
  };

  /* ================== LOGIN SCREEN ================== */
  if (screen === "login") {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>SadiCoin Tech</Text>
        <Text style={styles.subtitle}>
          Blockchain • Community • Events
        </Text>

        <Pressable style={styles.button} onPress={() => setScreen("home")}>
          <Text style={styles.buttonText}>Login</Text>
        </Pressable>

        <Pressable style={styles.button} onPress={() => setScreen("home")}>
          <Text style={styles.buttonText}>Register</Text>
        </Pressable>

        <Footer />
      </View>
    );
  }

  /* ================== HOME SCREEN ================== */
  return (
    <ScrollView style={{ backgroundColor: "#000" }}>
      <View style={styles.container}>
        <Text style={styles.title}>Dashboard</Text>

        {/* Wallet Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Wallet (Prototype)</Text>
          <Text style={styles.text}>Network: {wallet.network}</Text>
          <Text style={styles.text}>Address:</Text>
          <Text style={styles.address}>{wallet.address}</Text>
          <Text style={styles.text}>Balance: {wallet.balance}</Text>
        </View>

        {/* Price Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SDC Live Price</Text>
          {loading ? (
            <ActivityIndicator color="#FFD700" />
          ) : (
            <Text style={styles.price}>${price}</Text>
          )}
        </View>

        {/* Donation Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Donations</Text>
          <Text style={styles.text}>
            Send SDC to official contract:
          </Text>
          <Text style={styles.address}>{SDC_CONTRACT}</Text>
        </View>

        {/* Events Card */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Community Events</Text>
          <Text style={styles.text}>• School Soccer League</Text>
          <Text style={styles.text}>• Youth Athletics Day</Text>
          <Text style={styles.text}>• Blockchain Awareness Workshop</Text>
        </View>

        <Pressable style={styles.button} onPress={() => setScreen("login")}>
          <Text style={styles.buttonText}>Logout</Text>
        </Pressable>

        <Footer />
      </View>
    </ScrollView>
  );
}

/* ================== FOOTER ================== */
function Footer() {
  return (
    <Text style={styles.footer}>© SadiCoin Tech 2025</Text>
  );
}

/* ================== STYLES ================== */
const styles = StyleSheet.create({
  container: {
    padding: 24,
    alignItems: "center",
    backgroundColor: "#000",
    minHeight: "100%"
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFD700",
    marginBottom: 10
  },
  subtitle: {
    color: "#fff",
    marginBottom: 30
  },
  button: {
    backgroundColor: "#FFD700",
    padding: 14,
    marginVertical: 8,
    width: 240,
    borderRadius: 10
  },
  buttonText: {
    textAlign: "center",
    fontWeight: "bold"
  },
  card: {
    borderWidth: 1,
    borderColor: "#FFD700",
    borderRadius: 12,
    padding: 16,
    width: "100%",
    marginBottom: 16
  },
  cardTitle: {
    color: "#FFD700",
    fontWeight: "bold",
    marginBottom: 8
  },
  price: {
    color: "#00ff99",
    fontSize: 22
  },
  address: {
    color: "#fff",
    fontSize: 12
  },
  text: {
    color: "#fff",
    marginBottom: 4
  },
  footer: {
    color: "#666",
    marginTop: 30,
    fontSize: 12
  }
});