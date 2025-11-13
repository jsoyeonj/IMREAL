// @ts-nocheck 
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

export default function DetectionResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // 파라미터로 받은 데이터
  const imageUri = params.imageUri as string;
  const isSafe = params.isSafe === 'true';
  
  // 랜덤 그래프 데이터 생성
  const [graphData, setGraphData] = useState({ fake: 0, real: 0 });
  
  useEffect(() => {
    // 랜덤 확률 생성 (0-100)
    const fakeScore = isSafe 
      ? Math.floor(Math.random() * 30) + 5   // 안전: 5-35%
      : Math.floor(Math.random() * 40) + 60; // 위험: 60-100%
    
    const realScore = 100 - fakeScore;
    
    setGraphData({ fake: fakeScore, real: realScore });
  }, [isSafe]);

  return (
    <SafeAreaView style={styles.container}>
      {/* 헤더 */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>탐지 결과</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView 
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* 업로드한 이미지 */}
        <View style={styles.imageContainer}>
          <Image 
            source={{ uri: imageUri }} 
            style={styles.uploadedImage}
            resizeMode="cover"
          />
        </View>

        {/* 결과 멘트 */}
        <View style={styles.messageContainer}>
          <Text style={styles.messageTitle}>
            {isSafe 
              ? '진짜 이미지로\n판단됩니다!' 
              : '주의가 필요한 이미지로\n판단됩니다!'}
          </Text>
        </View>

        {/* 그래프 섹션 (축 제거, 중앙 정렬) */}
        <View style={styles.graphContainer}>
          <View style={styles.bars}>
            {/* Fake 바 */}
            <View style={styles.barContainer}>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    styles.barFake,
                    { height: `${graphData.fake}%` }
                  ]} 
                />
              </View>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barLabel}>fake</Text>
                <Text style={styles.barPercentage}>{graphData.fake}%</Text>
              </View>
            </View>

            {/* Real 바 */}
            <View style={styles.barContainer}>
              <View style={styles.barBackground}>
                <View 
                  style={[
                    styles.barFill, 
                    styles.barReal,
                    { height: `${graphData.real}%` }
                  ]} 
                />
              </View>
              <View style={styles.barLabelContainer}>
                <Text style={styles.barLabel}>real</Text>
                <Text style={styles.barPercentage}>{graphData.real}%</Text>
              </View>
            </View>
          </View>
        </View>

        {/* 하단 버튼 */}
        <TouchableOpacity 
          style={styles.homeButton}
          onPress={() => router.push('/home')}
        >
          <Text style={styles.homeButtonText}>홈으로 돌아가기</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  content: {
    padding: 20,
    paddingBottom: 40,
  },
  
  // 이미지 섹션
  imageContainer: {
    width: '100%',
    height: 280,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 24,
  },
  uploadedImage: {
    width: '100%',
    height: '100%',
  },
  
  // 메시지 섹션
  messageContainer: {
    alignItems: 'center',
    marginBottom: 40,
  },
  messageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    lineHeight: 32,
  },
  
  // 그래프 섹션 (축 제거, 중앙 정렬)
  graphContainer: {
    alignItems: 'center',
    marginBottom: 40,
    paddingVertical: 20,
  },
  bars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'center',
    gap: 60,
    height: 280,
  },
  barContainer: {
    width: 100,
    alignItems: 'center',
  },
  barBackground: {
    width: '100%',
    height: 240,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barFill: {
    width: '100%',
    borderRadius: 12,
  },
  barFake: {
    backgroundColor: '#FF6B6B',
  },
  barReal: {
    backgroundColor: '#4C9AFF',
  },
  barLabelContainer: {
    marginTop: 16,
    alignItems: 'center',
  },
  barLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 6,
  },
  barPercentage: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  
  // 버튼
  homeButton: {
    width: '100%',
    paddingVertical: 16,
    backgroundColor: '#0071E3',
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  homeButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
});