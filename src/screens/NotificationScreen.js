import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';
import { notifications } from '../data/mockData';

export default function NotificationScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>알림</Text>
        <TouchableOpacity>
          <Text style={styles.clearText}>모두 읽음</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ padding: 14, gap: 8 }}
        renderItem={({ item }) => (
          <TouchableOpacity style={[styles.notifCard, !item.read && styles.notifUnread]}>
            <View style={{ position: 'relative' }}>
              <Avatar emoji={item.avatar} bg={item.avatarBg} size={46} />
              {!item.read && <View style={styles.unreadDot} />}
            </View>
            <View style={styles.notifInfo}>
              <View style={styles.notifHeader}>
                <Text style={styles.notifTitle}>{item.title}</Text>
                <Text style={styles.notifTime}>{item.time}</Text>
              </View>
              <Text style={styles.notifBody}>{item.body}</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  backText: { fontSize: 20, color: Colors.text },
  headerTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  clearText: { fontSize: 13, color: Colors.primary, fontWeight: '600' },
  notifCard: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    borderWidth: 0.5,
    borderColor: Colors.border,
  },
  notifUnread: { borderColor: Colors.primary, borderWidth: 1, backgroundColor: '#f8f8ff' },
  unreadDot: {
    position: 'absolute',
    top: 0,
    right: 0,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.red,
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  notifInfo: { flex: 1, gap: 4 },
  notifHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  notifTitle: { fontSize: 14, fontWeight: '700', color: Colors.black },
  notifTime: { fontSize: 11, color: Colors.textMute },
  notifBody: { fontSize: 13, color: Colors.textSub, lineHeight: 18 },
});
