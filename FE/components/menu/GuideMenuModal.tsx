// components/menu/GuideMenuModal.tsx
import React from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import type { Href } from 'expo-router';  // ✨ 추가!

interface GuideMenuModalProps {
  visible: boolean;
  onClose: () => void;
}

export const GuideMenuModal: React.FC<GuideMenuModalProps> = ({
  visible,
  onClose,
}) => {
  const router = useRouter();

  const menuItems = [
    {
      id: 1,
      icon: 'book-outline',
      title: '앱 사용 설명서',
      description: '기능별 사용 방법 안내',
      route: '/guide/user-manual',
      color: '#4ECDC4',
    },
    {
      id: 2,
      icon: 'help-circle-outline',
      title: 'FAQ/자주 묻는 질문',
      description: '궁금한 점을 빠르게 해결',
      route: '/guide/faq',
      color: '#7C3AED',
    },
    {
      id: 3,
      icon: 'information-circle-outline',
      title: '앱 정보/개발진 소개',
      description: '앱 버전, 개발팀, 라이선스',
      route: '/guide/about',
      color: '#F59E0B',
    },
    {
      id: 4,
      icon: 'link-outline',
      title: '유용한 링크 모음',
      description: '딥페이크 관련 외부 리소스',
      route: '/guide/resources',
      color: '#10B981',
    },
  ];

  const handleMenuPress = (route: string) => {
    onClose();
    router.push(route as Href);  // ✨ as Href로 타입 단언!
  };

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>도움말 및 정보</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <Ionicons name="close" size={24} color="#666" />
            </TouchableOpacity>
          </View>

          {/* 메뉴 아이템들 */}
          <ScrollView
            contentContainerStyle={styles.menuList}
            showsVerticalScrollIndicator={false}
          >
            {menuItems.map((item) => (
              <TouchableOpacity
                key={item.id}
                style={styles.menuItem}
                onPress={() => handleMenuPress(item.route)}
                activeOpacity={0.7}
              >
                <View
                  style={[styles.iconContainer, { backgroundColor: item.color }]}
                >
                  <Ionicons name={item.icon as any} size={28} color="#FFF" />
                </View>
                <View style={styles.menuTextContainer}>
                  <Text style={styles.menuTitle}>{item.title}</Text>
                  <Text style={styles.menuDescription}>{item.description}</Text>
                </View>
                <Ionicons name="chevron-forward" size={20} color="#CCC" />
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modalContainer: {
    width: '100%',
    maxWidth: 500,
    backgroundColor: '#FFF',
    borderRadius: 20,
    overflow: 'hidden',
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
  },
  closeButton: {
    padding: 4,
  },
  menuList: {
    padding: 16,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#F9F9F9',
    borderRadius: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  iconContainer: {
    width: 56,
    height: 56,
    borderRadius: 14,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: {
    flex: 1,
  },
  menuTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  menuDescription: {
    fontSize: 13,
    color: '#666',
  },
});