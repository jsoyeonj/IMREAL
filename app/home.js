import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

export default function Home() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null); // pressedCard → selectedCard

  const cards = [
    { 
      id: 1, 
      title: 'DeepFake 탐지', 
      subtitle: '이미지로부터 탐지',
      icon: 'eye-outline',
    },
    { 
      id: 2, 
      title: '이미지 보호', 
      subtitle: 'AI로부터 정보 보호',
      icon: 'image-outline',
    },
    { 
      id: 3, 
      title: '워터마크 추가하기', 
      subtitle: '보이지 않는 워터마크',
      icon: 'shield-checkmark-outline',
    },
    { 
      id: 4, 
      title: '딥페이크 알아보기', 
      subtitle: '딥페이크 최신 뉴스',
      icon: 'newspaper-outline',
    },
  ];

  const history = [
    { id: 1, status: 'safe', title: '안전한 딥페이크', subtitle: '자세히 보기', date: '2025.09.13', time: '17:05' },
    { id: 2, status: 'danger', title: '수상한 딥페이크', subtitle: '자세히 보기', date: '2025.09.13', time: '16:05' },
    { id: 3, status: 'danger', title: '수상한 딥페이크', subtitle: '자세히 보기', date: '2025.09.13', time: '16:05' },
  ];

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="person-circle-outline" size={40} color="#333" />
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Welcome Home,</Text>
              <Text style={styles.userName}>다영 김</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.addButton}>
            <Ionicons name="add" size={24} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Cards Grid */}
        <View style={styles.cardsContainer}>
          {cards.map((card) => {
            const isSelected = selectedCard === card.id;
            return (
              <TouchableOpacity
                key={card.id}
                style={[
                  styles.card,
                  { backgroundColor: isSelected ? '#26C6DA' : '#FFFFFF' }
                ]}
                onPress={() => setSelectedCard(card.id)}
                activeOpacity={0.7}
              >
                <Ionicons 
                  name={card.icon} 
                  size={32} 
                  color={isSelected ? '#FFFFFF' : '#333'} 
                />
                <Text style={[
                  styles.cardTitle,
                  { color: isSelected ? '#FFFFFF' : '#333' }
                ]}>
                  {card.title}
                </Text>
                <Text style={[
                  styles.cardSubtitle,
                  { color: isSelected ? 'rgba(255,255,255,0.9)' : '#666' }
                ]}>
                  {card.subtitle}
                </Text>
                <View style={styles.cardArrow}>
                  <Ionicons 
                    name="arrow-forward-circle-outline" 
                    size={36} 
                    color={isSelected ? '#FFFFFF' : '#333'} 
                  />
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* History Section */}
        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>내 탐지 기록</Text>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.historyDate}>2025년 9월 13일</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </View>
          </View>

          {history.map((item) => (
            <View key={item.id} style={styles.historyItem}>
              <View style={styles.historyLeft}>
                <View style={styles.thumbnail} />
                <View style={styles.historyInfo}>
                  <View style={styles.historyTitleRow}>
                    <View style={[
                      styles.statusDot,
                      item.status === 'safe' ? styles.safeDot : styles.dangerDot
                    ]} />
                    <Text style={styles.historyItemTitle}>{item.title}</Text>
                  </View>
                  <Text style={styles.historyItemSubtitle}>{item.subtitle}</Text>
                  <Text style={styles.historyItemDate}>{item.date}</Text>
                </View>
              </View>
              <Text style={styles.historyItemTime}>{item.time}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Floating Action Button */}
      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 14,
    color: '#999',
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  addButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 20,
    gap: 16,
  },
  card: {
    width: '47%',
    aspectRatio: 1,
    borderRadius: 20,
    padding: 20,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
  },
  cardSubtitle: {
    fontSize: 12,
    marginTop: 4,
  },
  cardArrow: {
    alignSelf: 'flex-start',
    marginTop: 8,
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginBottom: 100,
    borderRadius: 16,
    padding: 20,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  historyDate: {
    fontSize: 12,
    color: '#666',
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  historyLeft: {
    flexDirection: 'row',
    flex: 1,
  },
  thumbnail: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#E0E0E0',
    marginRight: 12,
  },
  historyInfo: {
    flex: 1,
  },
  historyTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  safeDot: {
    backgroundColor: '#4CAF50',
  },
  dangerDot: {
    backgroundColor: '#F44336',
  },
  historyItemTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
  },
  historyItemSubtitle: {
    fontSize: 12,
    color: '#999',
    marginTop: 4,
    marginLeft: 16,
  },
  historyItemDate: {
    fontSize: 11,
    color: '#CCC',
    marginTop: 2,
    marginLeft: 16,
  },
  historyItemTime: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
});