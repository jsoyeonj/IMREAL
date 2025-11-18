// app/guide/user-manual.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { USER_MANUAL_DATA } from '../../constants/guideData';

export default function UserManual() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => router.back()}
          style={styles.backButton}
        >
          <Ionicons name="arrow-back" size={24} color="#111" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>앱 사용 설명서</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 인트로 */}
        <View style={styles.introSection}>
          <Ionicons name="book-outline" size={48} color="#4ECDC4" />
          <Text style={styles.introTitle}>IMREAL 사용 가이드</Text>
          <Text style={styles.introDescription}>
            딥페이크 감지부터 이미지 보호까지{'\n'}
            모든 기능을 쉽게 사용해보세요
          </Text>
        </View>

        {/* 섹션들 */}
        {USER_MANUAL_DATA.sections.map((section, sectionIndex) => (
          <View key={sectionIndex} style={styles.section}>
            <Text style={styles.sectionTitle}>{section.title}</Text>

            {section.items.map((item, itemIndex) => (
              <View key={itemIndex} style={styles.item}>
                {item.subtitle && (
                  <Text style={styles.itemSubtitle}>{item.subtitle}</Text>
                )}
                <Text style={styles.itemContent}>{item.content}</Text>
              </View>
            ))}
          </View>
        ))}

        {/* 하단 여백 */}
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
  },
  content: {
    padding: 20,
  },
  introSection: {
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
    backgroundColor: '#F0FDFC',
    borderRadius: 16,
    marginBottom: 32,
  },
  introTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    marginTop: 16,
    marginBottom: 8,
  },
  introDescription: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
  },
  item: {
    marginBottom: 20,
    paddingLeft: 12,
    borderLeftWidth: 3,
    borderLeftColor: '#4ECDC4',
  },
  itemSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  itemContent: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
  },
});