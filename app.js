import React, { useState, useRef, useEffect } from 'react';
import { View, Text, ScrollView, FlatList, Image, TouchableOpacity, StyleSheet, TextInput, Animated, Dimensions, Modal, PanResponder } from 'react-native';
import { AntDesign, MaterialIcons } from '@expo/vector-icons';

const screenWidth = Dimensions.get('window').width;

// ===== Demo Data =====
const banners = [
  { id: 'b1', image: 'https://via.placeholder.com/400x150?text=Promo+1' },
  { id: 'b2', image: 'https://via.placeholder.com/400x150?text=Promo+2' },
  { id: 'b3', image: 'https://via.placeholder.com/400x150?text=Promo+3' },
];

const categories = ['Clothing', 'Books', 'Electronics', 'Crypto Gear', 'Games', 'Beauty'];
const products = Array.from({ length: 8 }).map((_, i) => ({
  id: `p${i + 1}`,
  title: `Product ${i + 1}`,
  price: (i + 1) * 10,
  image: `https://via.placeholder.com/150?text=Prod+${i + 1}`
}));

const contacts = [
  { id: 'c1', name: 'Alice', wallet: '0x1234…abcd' },
  { id: 'c2', name: 'Bob', wallet: '0x5678…efgh' },
];

// ===== Payment Animation =====
const PaymentPopup = ({ visible, message }) => {
  const fade = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    if (visible) {
      Animated.timing(fade, { toValue: 1, duration: 500, useNativeDriver: true }).start(() => {
        setTimeout(() => Animated.timing(fade, { toValue: 0, duration: 500, useNativeDriver: true }).start(), 1500);
      });
    }
  }, [visible]);
  return <Animated.View style={[styles.paymentPopup, { opacity: fade }]}><Text style={{ color: '#fff' }}>{message}</Text></Animated.View>;
};

// ===== Screens =====
const HomeScreen = ({ openPaymentModal }) => {
  const [carouselIndex, setCarouselIndex] = useState(0);
  const scrollRef = useRef();

  // Auto-slide banners
  useEffect(() => {
    const interval = setInterval(() => {
      let next = (carouselIndex + 1) % banners.length;
      setCarouselIndex(next);
      scrollRef.current?.scrollTo({ x: next * (screenWidth - 20), animated: true });
    }, 3000);
    return () => clearInterval(interval);
  }, [carouselIndex]);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Marketplace</Text>

      {/* Carousel */}
      <ScrollView
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        style={{ marginVertical: 10 }}
        ref={scrollRef}
      >
        {banners.map(b => <Image key={b.id} source={{ uri: b.image }} style={styles.banner} />)}
      </ScrollView>

      {/* Categories */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginVertical: 10 }}>
        {categories.map(c => <View key={c} style={styles.categoryCard}><Text>{c}</Text></View>)}
      </ScrollView>

      {/* Product Grid */}
      <View style={styles.grid}>
        {products.map(p => (
          <TouchableOpacity key={p.id} style={styles.productCard} onPress={() => openPaymentModal(p)}>
            <Image source={{ uri: p.image }} style={styles.productImage} />
            <Text style={{ fontWeight: 'bold' }}>{p.title}</Text>
            <Text>${p.price}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const WalletScreen = () => {
  const [balance, setBalance] = useState({ fiat: 100, crypto: 5 });
  const [sendTo, setSendTo] = useState('');
  const [amount, setAmount] = useState('');
  const [showPayment, setShowPayment] = useState(false);

  const sendFunds = () => {
    if (!sendTo || !amount) return alert('Enter recipient & amount');
    setBalance({ fiat: balance.fiat - parseFloat(amount), crypto: balance.crypto - parseFloat(amount) * 0.01 });
    setShowPayment(true); setSendTo(''); setAmount('');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Wallet</Text>
      <Text>Fiat: ${balance.fiat.toFixed(2)}</Text>
      <Text>Crypto: {balance.crypto.toFixed(3)} ETH</Text>
      <TextInput placeholder="Recipient" value={sendTo} onChangeText={setSendTo} style={styles.input} />
      <TextInput placeholder="Amount" value={amount} onChangeText={setAmount} style={styles.input} keyboardType="numeric" />
      <TouchableOpacity style={styles.sendButton} onPress={sendFunds}><Text style={{ color: '#fff' }}>Send</Text></TouchableOpacity>
      <PaymentPopup visible={showPayment} message="Payment Sent!" />
    </View>
  );
};

const ChatScreen = () => {
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState('');
  const [showPayment, setShowPayment] = useState(false);
  const contact = contacts[0];

  // Swipe gestures setup
  const pan = useRef(new Animated.ValueXY()).current;
  const panResponder = useRef(PanResponder.create({
    onStartShouldSetPanResponder: () => true,
    onPanResponderMove: (_, gesture) => {
      pan.setValue({ x: gesture.dx, y: 0 });
    },
    onPanResponderRelease: (_, gesture) => {
      if (gesture.dx < -100) { alert(`Swipe left action: call / send money demo`); }
      Animated.spring(pan, { toValue: { x: 0, y: 0 }, useNativeDriver: true }).start();
    }
  })).current;

  const sendMessage = () => {
    if (!text) return;
    setMessages([...messages, { id: Date.now().toString(), text, fromMe: true }]);
    setText('');
  };

  const sendMoney = () => {
    setMessages([...messages, { id: Date.now().toString(), text: `Sent $10 to ${contact.name}`, fromMe: true }]);
    setShowPayment(true);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Chat with {contact.name}</Text>
      <ScrollView style={{ flex: 1, marginVertical: 10 }}>
        {messages.map(m => (
          <Animated.View
            {...panResponder.panHandlers}
            key={m.id}
            style={[styles.chatBubble, m.fromMe ? styles.chatRight : styles.chatLeft, { transform: pan.getTranslateTransform() }]}
          >
            <Text>{m.text}</Text>
          </Animated.View>
        ))}
      </ScrollView>
      <TextInput placeholder="Type message..." value={text} onChangeText={setText} style={styles.input} />
      <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
        <TouchableOpacity style={styles.sendButton} onPress={sendMessage}><Text style={{ color: '#fff' }}>Send</Text></TouchableOpacity>
        <TouchableOpacity style={[styles.sendButton, { backgroundColor: 'green' }]} onPress={sendMoney}><Text style={{ color: '#fff' }}>Send Money</Text></TouchableOpacity>
      </View>
      <PaymentPopup visible={showPayment} message="Money Sent!" />
    </View>
  );
};

const BusinessScreen = () => (
  <ScrollView style={styles.container}>
    <Text style={styles.title}>Business / Ads</Text>
    <Text>Create pages & promotions here (demo)</Text>
  </ScrollView>
);

// ===== Main App with Tabs & Payment Modal =====
export default function App() {
  const [tab, setTab] = useState('Home');
  const [paymentProduct, setPaymentProduct] = useState(null);

  const openPaymentModal = (product) => setPaymentProduct(product);
  const closePaymentModal = () => setPaymentProduct(null);

  const renderTab = () => {
    switch (tab) {
      case 'Home': return <HomeScreen openPaymentModal={openPaymentModal} />;
      case 'Wallet': return <WalletScreen />;
      case 'Chat': return <ChatScreen />;
      case 'Business': return <BusinessScreen />;
    }
  };

  return (
    <View style={{ flex: 1 }}>
      {renderTab()}

      {/* Payment Modal */}
      <Modal visible={!!paymentProduct} transparent animationType="slide">
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>Buy {paymentProduct?.title}</Text>
            <Text>Price: ${paymentProduct?.price}</Text>
            <TouchableOpacity style={[styles.sendButton, { marginTop: 10 }]} onPress={() => { closePaymentModal(); alert('Payment confirmed!'); }}>
              <Text style={{ color: '#fff' }}>Pay Now</Text>
            </TouchableOpacity>
            <TouchableOpacity style={{ marginTop: 10 }} onPress={closePaymentModal}><Text style={{ color: 'red' }}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Bottom Tab */}
      <View style={styles.tabBar}>
        {['Home', 'Wallet', 'Chat', 'Business'].map(t =>
          <TouchableOpacity key={t} style={styles.tabItem} onPress={() => setTab(t)}>
            {t === 'Home' && <AntDesign name="home" size={24} color={tab === t ? '#0d6efd' : 'gray'} />}
            {t === 'Wallet' && <MaterialIcons name="account_balance_wallet" size={24} color={tab === t ? '#0d6efd' : 'gray'} />}
            {t === 'Chat' && <MaterialIcons name="chat" size={24} color={tab === t ? '#0d6efd' : 'gray'} />}
            {t === 'Business' && <AntDesign name="profile" size={24} color={tab === t ? '#0d6efd' : 'gray'} />}
            <Text style={{ color: tab === t ? '#0d6efd' : 'gray' }}>{t}</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

// ===== Styles =====
const styles = StyleSheet.create({
  container: { flex: 1, padding: 10, backgroundColor: '#f7f8fb' },
  title: { fontSize: 22, fontWeight: 'bold', marginBottom: 10 },
  banner: { width: screenWidth - 20, height: 150, marginRight: 10, borderRadius: 8 },
  categoryCard: { backgroundColor: '#fff', padding: 10, marginRight: 8, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  productCard: { width: '48%', backgroundColor: '#fff', padding: 10, marginBottom: 10, borderRadius: 8, shadowColor: '#000', shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 5 },
  productImage: { width: '100%', height: 100, borderRadius: 8, marginBottom: 5 },
  input: { borderWidth: 1, padding: 10, marginVertical: 5, borderRadius: 5, backgroundColor: '#fff', flex: 1 },
  sendButton: { backgroundColor: '#0d6efd', padding: 10, marginVertical: 5, alignItems: 'center', borderRadius: 5 },
  chatBubble: { padding: 10, borderRadius: 12, marginVertical: 5, maxWidth: '70%' },
  chatLeft: { backgroundColor: '#e9ecef', alignSelf: 'flex-start' },
  chatRight: { backgroundColor: '#0d6efd', alignSelf: 'flex-end', color: '#fff' },
  paymentPopup: { position: 'absolute', top: 50, alignSelf: 'center', backgroundColor: 'green', padding: 10, borderRadius: 8, zIndex: 1000 },
  tabBar: { flexDirection: 'row', justifyContent: 'space-around', paddingVertical: 10, backgroundColor: '#fff', borderTopWidth: 1, borderColor: '#ddd' },
  tabItem: { alignItems: 'center' },
  modalContainer: { flex: 1, justifyContent: 'center', backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContent: { backgroundColor: '#fff', margin: 20, padding: 20, borderRadius: 10, alignItems: 'center' },
});
