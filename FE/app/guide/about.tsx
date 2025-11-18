// app/guide/about.tsx
import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';
import { APP_ABOUT_DATA } from '../../constants/guideData';

export default function About() {
  const router = useRouter();

  const handleGitHubPress = async () => {
    try {
      // 실제 GitHub URL로 변경 필요
      await WebBrowser.openBrowserAsync('https://github.com/imreal-app');
    } catch (error) {
      Alert.alert('오류', '링크를 열 수 없습니다.');
    }
  };

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
        <Text style={styles.headerTitle}>앱 정보</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 앱 정보 */}
        <View style={styles.section}>
          <View style={styles.iconHeader}>
            <Ionicons name="information-circle" size={48} color="#F59E0B" />
          </View>
          <Text style={styles.appName}>{APP_ABOUT_DATA.appInfo.name}</Text>

          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>버전</Text>
              <Text style={styles.infoValue}>
                {APP_ABOUT_DATA.appInfo.version}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>최종 업데이트</Text>
              <Text style={styles.infoValue}>
                {APP_ABOUT_DATA.appInfo.lastUpdate}
              </Text>
            </View>
            <View style={styles.infoItem}>
              <Text style={styles.infoLabel}>지원 플랫폼</Text>
              <Text style={styles.infoValue}>
                {APP_ABOUT_DATA.appInfo.platforms}
              </Text>
            </View>
          </View>
        </View>

        {/* 개발 목적 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {APP_ABOUT_DATA.mission.title}
          </Text>
          <Text style={styles.description}>
            {APP_ABOUT_DATA.mission.description}
          </Text>

          {APP_ABOUT_DATA.mission.values.map((value, index) => (
            <View key={index} style={styles.valueSection}>
              <Text style={styles.valueTitle}>{value.title}</Text>
              {value.items.map((item, itemIndex) => (
                <View key={itemIndex} style={styles.valueItem}>
                  <Text style={styles.bullet}>•</Text>
                  <Text style={styles.valueText}>{item}</Text>
                </View>
              ))}
            </View>
          ))}
        </View>

        {/* 개발팀 소개 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>개발팀 소개</Text>
          <Text style={styles.teamTitle}>{APP_ABOUT_DATA.team.title}</Text>
          <Text style={styles.description}>
            {APP_ABOUT_DATA.team.description}
          </Text>

          <View style={styles.contactSection}>
            <Text style={styles.contactTitle}>Contact</Text>
            <View style={styles.contactItem}>
              <Ionicons name="mail-outline" size={18} color="#666" />
              <Text style={styles.contactText}>
                {APP_ABOUT_DATA.team.contact.email}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.contactItem}
              onPress={handleGitHubPress}
            >
              <Ionicons name="logo-github" size={18} color="#666" />
              <Text style={[styles.contactText, styles.linkText]}>
                {APP_ABOUT_DATA.team.contact.github}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* 기술스택 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>{APP_ABOUT_DATA.tech.title}</Text>
          {APP_ABOUT_DATA.tech.stack.map((tech, index) => (
            <View key={index} style={styles.techItem}>
              <Text style={styles.bullet}>•</Text>
              <Text style={styles.techText}>{tech}</Text>
            </View>
          ))}
        </View>

        {/* 라이선스 정보 */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>
            {APP_ABOUT_DATA.license.title}
          </Text>

          <View style={styles.licenseBlock}>
            <Text style={styles.licenseSubtitle}>앱 라이선스</Text>
            <Text style={styles.description}>
              {APP_ABOUT_DATA.license.appLicense}
            </Text>
          </View>

          <View style={styles.licenseBlock}>
            <Text style={styles.licenseSubtitle}>오픈소스 라이선스</Text>
            <Text style={styles.description}>
              본 앱은 다음 오픈소스 라이브러리를 사용합니다:
            </Text>
            {APP_ABOUT_DATA.license.openSource.map((item, index) => (
              <View key={index} style={styles.techItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.techText}>{item}</Text>
              </View>
            ))}
          </View>

          <View style={styles.licenseBlock}>
            <Text style={styles.licenseSubtitle}>데이터 정책</Text>
            {APP_ABOUT_DATA.license.dataPolicy.map((item, index) => (
              <View key={index} style={styles.techItem}>
                <Text style={styles.bullet}>•</Text>
                <Text style={styles.techText}>{item}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* 감사의 말 */}
        <View style={[styles.section, styles.thanksSection]}>
          <Text style={styles.sectionTitle}>
            {APP_ABOUT_DATA.thanks.title}
          </Text>
          <Text style={styles.description}>
            {APP_ABOUT_DATA.thanks.message}
          </Text>
        </View>

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
  section: {
    marginBottom: 32,
  },
  iconHeader: {
    alignItems: 'center',
    marginBottom: 16,
  },
  appName: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 24,
  },
  infoGrid: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    gap: 12,
  },
  infoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    fontWeight: '500',
  },
  infoValue: {
    fontSize: 14,
    color: '#111',
    fontWeight: '600',
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  description: {
    fontSize: 14,
    color: '#666',
    lineHeight: 22,
    marginBottom: 16,
  },
  valueSection: {
    marginTop: 16,
  },
  valueTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  valueItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  bullet: {
    fontSize: 14,
    color: '#F59E0B',
    marginRight: 8,
    fontWeight: '700',
  },
  valueText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  teamTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111',
    marginBottom: 8,
  },
  contactSection: {
    backgroundColor: '#F9F9F9',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
  },
  contactTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#333',
    marginBottom: 12,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  contactText: {
    fontSize: 14,
    color: '#666',
    marginLeft: 8,
  },
  linkText: {
    color: '#4ECDC4',
    textDecorationLine: 'underline',
  },
  techItem: {
    flexDirection: 'row',
    marginBottom: 6,
    paddingLeft: 8,
  },
  techText: {
    flex: 1,
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  licenseBlock: {
    marginBottom: 20,
  },
  licenseSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  thanksSection: {
    backgroundColor: '#F0FDFC',
    padding: 20,
    borderRadius: 12,
  },
});