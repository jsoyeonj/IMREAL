import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  const router = useRouter();
  const [selectedCard, setSelectedCard] = useState(null);
  const [userName, setUserName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);

  // 저장된 이름 불러오기
  useEffect(() => {
    const loadUserName = async () => {
      try {
        // @user_data 키로 저장된 사용자 정보 불러오기
        const userData = await AsyncStorage.getItem('@user_data');
        console.log('불러온 사용자 정보:', userData);
        if (userData) {
          const user = JSON.parse(userData);
          console.log('파싱된 사용자:', user);
          if (user.nickname) {
            setUserName(user.nickname);
          }
        }
      } catch (error) {
        console.error('이름 불러오기 실패:', error);
      }
    };
    loadUserName();
  }, []);

  const cards = [
    { 
      id: 1, 
      title: 'DeepFake 탐지', 
      subtitle: '이미지로부터 탐지',
      icon: 'eye-outline',
      route: '/deepfake/detection',
    },
    { 
      id: 2, 
      title: '이미지 보호', 
      subtitle: 'AI로부터 정보 보호',
      icon: 'image-outline',
      route: '/protection/image-protection',
    },
    { 
      id: 3, 
      title: '워터마크 추가하기', 
      subtitle: '보이지 않는 워터마크',
      icon: 'shield-checkmark-outline',
      route: '/watermark/add-watermark',
    },
    { 
      id: 4, 
      title: '딥페이크 알아보기', 
      subtitle: '딥페이크 최신 뉴스',
      icon: 'newspaper-outline',
      route: '/news/news-list',
    },
  ];

  const history = [
    { id: 1, status: 'safe', title: '안전한 딥페이크', subtitle: '자세히 보기', date: '2025.09.13', time: '17:05' },
    { id: 2, status: 'danger', title: '수상한 딥페이크', subtitle: '자세히 보기', date: '2025.09.13', time: '16:05' },
    { id: 3, status: 'danger', title: '수상한 딥페이크', subtitle: '자세히 보기', date: '2025.09.13', time: '16:05' },
  ];

  const handleCardPress = (card) => {
    setSelectedCard(card.id);
    if (card.route) {
      console.log('이동:', card.route);
      router.push(card.route);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.multiRemove(['@auth_token', '@user_data']);
      console.log('로그아웃 - 모든 데이터 삭제 완료');
    } catch (error) {
      console.error('로그아웃 실패:', error);
    }
    console.log('로그아웃');
    router.replace('/login');
  };
  
  const handleDatePress = () => {
    setShowDatePicker(true);
  };

  const handleDateChange = (event, date) => {
    if (Platform.OS === 'android') {
      setShowDatePicker(false);
    }
    if (date) {
      setSelectedDate(date);
    }
  };

  const formatDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}년 ${month}월 ${day}일`; 
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#F5F5F5' }}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <Ionicons name="person-circle-outline" size={40} color="#333" />
            <View style={styles.headerText}>
              <Text style={styles.welcomeText}>Welcome Home,</Text>
              <Text style={styles.userName}>{userName}</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>LogOut</Text>
          </TouchableOpacity>
        </View>

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
                onPress={() => handleCardPress(card)}
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

        <View style={styles.historySection}>
          <View style={styles.historyHeader}>
            <Text style={styles.historyTitle}>내 탐지 기록</Text>
            <TouchableOpacity 
              style={styles.dateContainer} 
              onPress={handleDatePress}
              activeOpacity={0.7}
            >
              <Ionicons name="calendar-outline" size={16} color="#666" />
              <Text style={styles.historyDate}>{formatDate(selectedDate)}</Text>
              <Ionicons name="chevron-down" size={16} color="#666" />
            </TouchableOpacity>
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

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {showDatePicker && Platform.OS === 'ios' && (
        <View style={styles.iosDatePickerContainer}>
          <View style={styles.iosDatePickerHeader}>
            <TouchableOpacity onPress={() => setShowDatePicker(false)}>
              <Text style={styles.iosDatePickerButton}>완료</Text>
            </TouchableOpacity>
          </View>
          <DateTimePicker
            value={selectedDate}
            mode="date"
            display="spinner"
            onChange={handleDateChange}
            maximumDate={new Date()}
          />
        </View>
      )}

      {showDatePicker && Platform.OS === 'android' && (
        <DateTimePicker
          value={selectedDate}
          mode="date"
          display="default"
          onChange={handleDateChange}
          maximumDate={new Date()}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerText: {
    marginLeft: 12,
  },
  welcomeText: {
    fontSize: 12,
    color: '#999',
    marginBottom: 2,
  },
  userName: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
  },
  logoutButton: {
    backgroundColor: '#FF6B6B',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
  },
  logoutText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  cardsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    padding: 16,
    gap: 16,
  },
  card: {
    width: 160,
    height: 160,
    padding: 20,
    borderRadius: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 12,
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
  },
  cardArrow: {
    position: 'absolute',
    bottom: 16,
    right: 16,
  },
  historySection: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    padding: 16,
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  historyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  historyTitle: {
    fontSize: 18,
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
    alignItems: 'center',
    flex: 1,
  },
  thumbnail: {
    width: 48,
    height: 48,
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
    marginBottom: 4,
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
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
    marginBottom: 4,
  },
  historyItemDate: {
    fontSize: 11,
    color: '#CCC',
  },
  historyItemTime: {
    fontSize: 12,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    bottom: 30,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#2196F3',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  fabText: {
    fontSize: 32,
    color: '#FFFFFF',
    fontWeight: '300',
  },
  iosDatePickerContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 5,
  },
  iosDatePickerHeader: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  iosDatePickerButton: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2196F3',
  },
});