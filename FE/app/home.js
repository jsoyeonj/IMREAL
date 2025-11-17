import DateTimePicker from '@react-native-community/datetimepicker'
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useState, useEffect } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View, Platform, Image, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { API_ENDPOINTS } from '../config/api';
import { useFocusEffect } from '@react-navigation/native';  // ← 이거 추가!
import { useCallback } from 'react';  // ← 이거도 추가!
import { useAuth } from '../contexts/AuthContext';
import { getAnalysisRecords } from '../services/deepfakeApi';
import { ProfileImageModal } from '../components/profile/ProfileImageModal';
import { uploadProfileImage, getProfileImage } from '../services/profileApi';
import * as ImagePicker from 'expo-image-picker';

export default function Home() {
  const router = useRouter();
  const { token, user } = useAuth();
  const [selectedCard, setSelectedCard] = useState(null);
  const [userName, setUserName] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [displayCount, setDisplayCount] = useState(3);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [profileImageUrl, setProfileImageUrl] = useState(null);
  const [showProfileModal, setShowProfileModal] = useState(false);

  // 저장된 이름 불러오기
  useEffect(() => {
    const loadUserName = async () => {
      try {
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

  useEffect(() => {
  const loadProfileImage = async () => {
    const data = await getProfileImage();
    if (data.profile_image_url) {
      setProfileImageUrl(data.profile_image_url);
    }
  };
  loadProfileImage();
}, []);

  // 화면이 포커스될 때마다 탐지기록 새로고침
  useFocusEffect(
    useCallback(() => {
      loadDetectionHistory();
    }, [])
  );

  // 탐지기록 불러오기
  const loadDetectionHistory = async () => {
    setIsLoadingHistory(true);
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      
      if (!token) {
        console.log('토큰이 없습니다');
        setIsLoadingHistory(false);
        return;
      }

      const response = await fetch(API_ENDPOINTS.DETECTION_RECORDS, {
        method: 'GET',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log('탐지기록 불러오기 성공:', data);
        
        // API 응답에서 records 배열 추출 (DRF pagination 형식 우선)
        let records = [];
        if (Array.isArray(data)) {
          records = data;
        } else if (data.results && Array.isArray(data.results)) {
          records = data.results;  // ← 이게 먼저 체크되어야 함!
        } else if (data.records && Array.isArray(data.records)) {
          records = data.records;
        }
        
        console.log('추출된 records:', records);
        
        // 최신순 정렬
        const sortedData = records.sort((a, b) => 
          new Date(b.created_at) - new Date(a.created_at)
        );
        
        setHistory(sortedData);
      } else {
        console.error('탐지기록 불러오기 실패:', response.status);
      }
    } catch (error) {
      console.error('탐지기록 불러오기 오류:', error);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // 더 보기
  const loadMore = () => {
    setDisplayCount(prev => prev + 3);
  };

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
  setShowDatePicker(false);  // ✅ 모든 플랫폼에서 닫기
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
  const handleProfilePress = () => {
  setShowProfileModal(true);
};

const handleSelectFromGallery = async () => {
  setShowProfileModal(false);
  
  try {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('권한 필요', '갤러리 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      await handleUploadProfileImage(imageUri);
    }
  } catch (error) {
    console.error('갤러리 선택 오류:', error);
    Alert.alert('오류', '이미지를 불러오는데 실패했습니다.');
  }
};

const handleTakePhoto = async () => {
  setShowProfileModal(false);
  
  try {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('권한 필요', '카메라 접근 권한이 필요합니다.');
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });

    if (!result.canceled && result.assets[0]) {
      const imageUri = result.assets[0].uri;
      await handleUploadProfileImage(imageUri);
    }
  } catch (error) {
    console.error('사진 촬영 오류:', error);
    Alert.alert('오류', '사진을 촬영하는데 실패했습니다.');
  }
};

const handleUploadProfileImage = async (imageUri) => {
  try {
    const data = await uploadProfileImage(imageUri);
    if (data.profile_image_url) {
      setProfileImageUrl(data.profile_image_url);
      Alert.alert('성공', '프로필 사진이 변경되었습니다!');
    }
  } catch (error) {
    Alert.alert('업로드 실패', error.message || '다시 시도해주세요.');
  }
};

  // ✅ 날짜 비교 함수 추가!
const isSameDate = (date1, date2) => {
  return (
    date1.getFullYear() === date2.getFullYear() &&
    date1.getMonth() === date2.getMonth() &&
    date1.getDate() === date2.getDate()
  );
};

// ✅ 날짜별로 필터링된 기록
const filteredByDate = history.filter(item => {
  // created_at을 Date 객체로 변환
  const itemDate = new Date(item.created_at.split(' ')[0]); // "2025-11-16 22:02:30" -> "2025-11-16"
  return isSameDate(itemDate, selectedDate);
});

// ✅ 표시할 기록 (날짜 필터링 + 개수 제한)
const displayedHistory = filteredByDate.slice(0, displayCount);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} style={{ backgroundColor: '#F5F5F5' }}>
        <View style={styles.header}>
  <View style={styles.headerLeft}>
    {/* ✅ 프로필 이미지 또는 기본 아이콘 */}
    <TouchableOpacity onPress={handleProfilePress}>
      {profileImageUrl ? (
        <Image 
          source={{ uri: profileImageUrl }} 
          style={styles.profileImage}
        />
      ) : (
        <Ionicons name="person-circle-outline" size={40} color="#333" />
      )}
    </TouchableOpacity>
    
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

          {isLoadingHistory ? (
            <Text style={{ textAlign: 'center', color: '#999', paddingVertical: 20 }}>
              불러오는 중...
            </Text>
          ) : displayedHistory.length === 0 ? (
            <Text style={{ textAlign: 'center', color: '#999', paddingVertical: 20 }}>
              {formatDate(selectedDate)}에 탐지 기록이 없습니다 
            </Text>
          ) : (
            <>
              {displayedHistory.map((item) => (
  <View key={item.record_id} style={styles.historyItem}>
    <View style={styles.historyLeft}>
      {/* ✅ 이미지 표시 */}
      {item.image_url ? (
        <Image 
          source={{ uri: item.image_url }} 
          style={styles.thumbnail}
        />
      ) : (
        <View style={styles.thumbnail} />
      )}
      
      <View style={styles.historyInfo}>
        <View style={styles.historyTitleRow}>
          <View style={[
            styles.statusDot,
            item.is_deepfake ? styles.dangerDot : styles.safeDot
          ]} />
          <Text style={styles.historyItemTitle}>
            {item.is_deepfake ? '수상한 딥페이크' : '안전한 이미지'}
          </Text>
        </View>
        <Text style={styles.historyItemSubtitle}>자세히 보기</Text>
        <Text style={styles.historyItemDate}>
          {item.created_at.split(' ')[0]}
        </Text>
      </View>
    </View>
    <Text style={styles.historyItemTime}>
      {item.created_at.split(' ')[1].substring(0, 5)}
    </Text>
  </View>
))}
              
              {filteredByDate.length > displayCount && (
                <TouchableOpacity 
                  onPress={loadMore} 
                  style={styles.loadMoreButton}
                  activeOpacity={0.7}
                >
                  <Text style={styles.loadMoreText}>더 보기</Text>
                  <Ionicons name="chevron-down" size={16} color="#666" />
                </TouchableOpacity>
              )}
            </>
          )}
        </View>
      </ScrollView>

      <TouchableOpacity style={styles.fab}>
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>

      {showDatePicker && Platform.OS === 'ios' && (
  <View style={styles.iosDatePickerOverlay}>
    <View style={styles.iosDatePickerModal}>
      <View style={styles.iosDatePickerHeader}>
        <Text style={styles.iosDatePickerTitle}>날짜 선택</Text>
        <TouchableOpacity onPress={() => setShowDatePicker(false)}>
          <Text style={styles.iosDatePickerButton}>완료</Text>
        </TouchableOpacity>
      </View>
      <DateTimePicker
        value={selectedDate}
        mode="date"
        display="inline"
        onChange={handleDateChange}
        maximumDate={new Date()}
        locale="ko-KR"
        themeVariant="light"
      />
    </View>
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
      <ProfileImageModal
        visible={showProfileModal}
        onClose={() => setShowProfileModal(false)}
        onSelectGallery={handleSelectFromGallery}
        onSelectCamera={handleTakePhoto}
      />
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
    justifyContent: 'center', 
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
  loadMoreButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    marginTop: 8,
    gap: 6,
  },
  loadMoreText: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
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
  iosDatePickerOverlay: {
  position: 'absolute',
  top: 0,
  bottom: 0,
  left: 0,
  right: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  justifyContent: 'center',    // ✅ 'flex-end' → 'center'로 변경!
  alignItems: 'center',        // ✅ 추가!
  padding: 20,                 // ✅ 양옆 여백 추가
  zIndex: 1000,
},
iosDatePickerModal: {
  backgroundColor: '#FFFFFF',
  borderRadius: 20,            // ✅ 전체 둥글게 (하단만 → 전체)
  paddingBottom: 30,
  maxHeight: '65%',
  width: '100%',               // ✅ 추가!
  shadowColor: '#000',         // ✅ 그림자 추가
  shadowOffset: {
    width: 0,
    height: 2,
  },
  shadowOpacity: 0.25,
  shadowRadius: 8,
  elevation: 5,
},
iosDatePickerHeader: {
  flexDirection: 'row',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingHorizontal: 20,
  paddingVertical: 16,
  borderBottomWidth: 1,
  borderBottomColor: '#E0E0E0',
},
iosDatePickerTitle: {
  fontSize: 18,
  fontWeight: '700',
  color: '#333',
},
iosDatePickerButton: {
  fontSize: 16,
  fontWeight: '600',
  color: '#2196F3',
},
profileImage: {
  width: 40,
  height: 40,
  borderRadius: 20,
  backgroundColor: '#E0E0E0',
},
});