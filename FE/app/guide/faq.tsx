// app/guide/faq.tsx
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
import { FAQ_DATA } from '../../constants/guideData';
import { AccordionItem } from '../../components/menu/AccordionItem';

export default function FAQ() {
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
        <Text style={styles.headerTitle}>자주 묻는 질문</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 인트로 */}
        <View style={styles.introSection}>
          <Ionicons name="help-circle-outline" size={48} color="#7C3AED" />
          <Text style={styles.introTitle}>FAQ</Text>
          <Text style={styles.introDescription}>
            자주 묻는 질문에 대한 답변을{'\n'}
            빠르게 확인해보세요
          </Text>
        </View>

        {/* FAQ 카테고리별로 렌더링 */}
        {FAQ_DATA.map((category, categoryIndex) => (
          <View key={categoryIndex} style={styles.categorySection}>
            <Text style={styles.categoryTitle}>{category.category}</Text>

            {category.questions.map((item, itemIndex) => (
              <AccordionItem
                key={itemIndex}
                question={item.question}
                answer={item.answer}
                isFirst={itemIndex === 0}
              />
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
    backgroundColor: '#F5F3FF',
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
});