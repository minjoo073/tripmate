import React from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { Colors } from '../constants/colors';
import { Avatar } from '../components/common';
import { chatList, mates } from '../data/mockData';

export default function ChatListScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>채팅</Text>
        <View style={styles.unreadBadge}>
          <Text style={styles.unreadText}>2</Text>
        </View>
      </View>

      <FlatList
        data={chatList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const mate = mates.find((m) => m.id === item.mateId);
          return (
            <TouchableOpacity
              style={styles.chatRow}
              onPress={() => navigation.navigate('ChatRoom', { mate, chatId: item.id })}
            >
              <View style={{ position: 'relative' }}>
                <Avatar emoji={item.mateAvatar} bg={item.mateAvatarBg} size={48} />
                {item.status === 'confirmed' && (
                  <View style={styles.confirmedDot}>
                    <Text style={{ fontSize: 8 }}>✓</Text>
                  </View>
                )}
              </View>
              <View style={styles.chatInfo}>
                <View style={styles.chatNameRow}>
                  <Text style={styles.chatName}>{item.mateName}</Text>
                  <Text style={styles.chatTime}>{item.time}</Text>
                </View>
                <View style={styles.chatMsgRow}>
                  <Text style={styles.chatMsg} numberOfLines={1}>{item.lastMessage}</Text>
                  {item.unread > 0 && (
                    <View style={styles.unreadDot}>
                      <Text style={styles.unreadDotText}>{item.unread}</Text>
                    </View>
                  )}
                </View>
                {item.status === 'confirmed' && (
                  <View style={styles.statusBadge}>
                    <Text style={styles.statusText}>동행 확정</Text>
                  </View>
                )}
              </View>
            </TouchableOpacity>
          );
        }}
        ItemSeparatorComponent={() => <View style={styles.sep} />}
        ListEmptyComponent={
          <View style={styles.empty}>
            <Text style={styles.emptyIcon}>💬</Text>
            <Text style={styles.emptyTitle}>아직 채팅이 없어요</Text>
            <Text style={styles.emptySub}>메이트를 찾아서 먼저 말을 걸어보세요!</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 18,
    paddingVertical: 14,
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  headerTitle: { fontSize: 18, fontWeight: '800', color: Colors.black },
  unreadBadge: {
    backgroundColor: Colors.red,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  unreadText: { fontSize: 11, color: Colors.white, fontWeight: '700' },
  chatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: Colors.white,
  },
  confirmedDot: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: Colors.green,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.white,
  },
  chatInfo: { flex: 1, gap: 4 },
  chatNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatName: { fontSize: 15, fontWeight: '700', color: Colors.black },
  chatTime: { fontSize: 11, color: Colors.textMute },
  chatMsgRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  chatMsg: { fontSize: 13, color: Colors.textMute, flex: 1 },
  unreadDot: {
    backgroundColor: Colors.red,
    borderRadius: 10,
    paddingHorizontal: 6,
    paddingVertical: 1,
    marginLeft: 8,
  },
  unreadDotText: { fontSize: 11, color: Colors.white, fontWeight: '700' },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.greenBg,
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderWidth: 0.5,
    borderColor: Colors.greenBorder,
  },
  statusText: { fontSize: 10, color: Colors.green, fontWeight: '600' },
  sep: { height: 0.5, backgroundColor: Colors.borderLight, marginLeft: 76 },
  empty: { alignItems: 'center', paddingTop: 80, gap: 10 },
  emptyIcon: { fontSize: 48 },
  emptyTitle: { fontSize: 16, fontWeight: '700', color: Colors.black },
  emptySub: { fontSize: 13, color: Colors.textMute },
});
