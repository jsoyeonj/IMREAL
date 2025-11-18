// app/guide/resources.tsx
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
import { USEFUL_LINKS_DATA } from '../../constants/guideData';
import { ExternalLink } from '../../components/menu/ExternalLink';

export default function Resources() {
  const router = useRouter();

  // 카테고리별로 그룹화
  const groupedData = USEFUL_LINKS_DATA.reduce((acc, item) => {
    const category = item.category;
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(item);
    return acc;
  }, {} as Record<string, typeof USEFUL_LINKS_DATA>);

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
        <Text style={styles.headerTitle}>유용한 링크 모음</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 인트로 */}
        <View style={styles.introSection}>
          <Ionicons name="link-outline" size={48} color="#10B981" />
          <Text style={styles.introTitle}>외부 리소스</Text>
          <Text style={styles.introDescription}>
            딥페이크 관련 유용한 웹사이트와{'\n'}
            공식 기관 정보를 확인하세요
          </Text>
        </View>

        {/* 카테고리별 링크 */}
        {Object.entries(groupedData).map(([category, items], categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category}</Text>

            {items.map((item, itemIndex) => (
              <View key={itemIndex}>
                {item.subcategory && (
                  <Text style={styles.subcategoryTitle}>
                    {item.subcategory}
                  </Text>
                )}
                {item.links.map((link, linkIndex) => (
                  <ExternalLink
                    key={linkIndex}
                    title={link.title}
                    url={link.url}
                    description={link.description}
                  />
                ))}
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
    backgroundColor: '#F0FDF4',
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
  categorySection: {
    marginBottom: 32,
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    paddingLeft: 4,
  },
  subcategoryTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#666',
    marginTop: 12,
    marginBottom: 10,
    paddingLeft: 4,
  },
});