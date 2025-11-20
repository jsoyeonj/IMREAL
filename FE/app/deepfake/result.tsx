// FE/app/deepfake/result.tsx
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
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { ReportButton } from '../../components/report/ReportButton';
import { ReportModal } from '../../components/report/ReportModal';
import * as Sharing from 'expo-sharing';

const { width } = Dimensions.get('window');

export default function DetectionResult() {
  const router = useRouter();
  const params = useLocalSearchParams();
  
  // 파라미터로 받은 데이터
  const imageUri = params.imageUri as string;
  const isSafe = params.isSafe === 'true';
  const faceResultsStr = params.faceResults as string;
  
  // ✅ 얼굴 결과 파싱
  const [faceResults, setFaceResults] = useState([]);
  
  // ✅ 실제 데이터 기반 그래프 데이터
  const [graphData, setGraphData] = useState({ fake: 0, real: 0 });
  
  // 신고 모달 상태
  const [showReportModal, setShowReportModal] = useState(false);
  
  useEffect(() => {
    console.log('📦 받은 params:', params);
    console.log('📦 faceResultsStr:', faceResultsStr);
    
    // ✅ faceResults 파싱
    if (faceResultsStr) {
      try {
        const parsed = JSON.parse(faceResultsStr);
        setFaceResults(parsed);
        console.log('✅ 얼굴 결과 파싱 성공:', parsed);
        
        // ✅ 실제 데이터로 확률 계산
        if (parsed && parsed.length > 0) {
          // 모든 얼굴의 평균 신뢰도 계산
          const avgRate = parsed.reduce((sum, face) => sum + face.rate, 0) / parsed.length;
          const percentage = Math.round(avgRate * 100);
          
          // 딥페이크가 하나라도 있으면
          const hasDeepfake = parsed.some(face => face.is_deepfake);
          
          if (hasDeepfake) {
            setGraphData({ fake: percentage, real: 100 - percentage });
          } else {
            setGraphData({ fake: 100 - percentage, real: percentage });
          }
        }
      } catch (e) {
        console.error('❌ 얼굴 결과 파싱 오류:', e);
      }
    } else {
      console.warn('⚠️ faceResultsStr가 없습니다');
    }
  }, [isSafe, faceResultsStr]);

  // 이미지 다운로드 함수
  const handleDownloadImage = async () => {
    if (!imageUri) {
      Alert.alert('오류', '다운로드할 이미지가 없습니다.');
      return;
    }

    try {
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        return;
      }

      await Sharing.shareAsync(imageUri, {
        mimeType: 'image/jpeg',
        dialogTitle: '딥페이크 감지 이미지 저장하기',
      });

      console.log('이미지 공유 완료');
    } catch (error) {
      console.error('이미지 공유 실패:', error);
      Alert.alert('공유 실패', '이미지 공유 중 오류가 발생했습니다.');
    }
  };

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
          <Text style={styles.messageDesc}>
            {isSafe 
              ? 'AI가 분석한 결과, 이 이미지는 실제 사진일 가능성이 높습니다.'
              : 'AI가 분석한 결과, 이 이미지에는 의심스러운 부분이 발견되었습니다.'}
          </Text>
        </View>

        {/* ✅ 각 얼굴별 ResultUrl 표시 */}
        {faceResults && faceResults.length > 0 ? (
          <View style={styles.faceResultsContainer}>
            <Text style={styles.sectionTitle}>감지된 얼굴 ({faceResults.length}명)</Text>
            
            {faceResults.map((face, index) => (
              <View key={index} style={styles.faceCard}>
                <View style={styles.faceInfo}>
                  <Text style={styles.faceId}>얼굴 #{face.face_id}</Text>
                  <Text style={[
                    styles.faceStatus,
                    { color: face.is_deepfake ? '#FF6B6B' : '#4ECDC4' }
                  ]}>
                    {face.is_deepfake ? '딥페이크' : '진짜'}
                  </Text>
                  <Text style={styles.faceConfidence}>
                    신뢰도: {(face.rate * 100).toFixed(1)}%
                  </Text>
                </View>
                
                {/* ✅ ResultUrl이 있으면 이미지 표시 */}
                {face.ResultUrl ? (
                  <View style={styles.faceImageContainer}>
                    <Image 
                      source={{ uri: face.ResultUrl }} 
                      style={styles.faceImage}
                      resizeMode="cover"
                      onError={(error) => {
                        console.error('❌ 이미지 로드 실패:', face.ResultUrl, error);
                      }}
                      onLoad={() => {
                        console.log('✅ 이미지 로드 성공:', face.ResultUrl);
                      }}
                    />
                    <Text style={styles.faceImageLabel}>감지된 얼굴</Text>
                  </View>
                ) : (
                  <View style={styles.noImageContainer}>
                    <Text style={styles.noImageText}>감지된 얼굴 이미지 없음</Text>
                  </View>
                )}
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.noFaceContainer}>
            <Text style={styles.noFaceText}>얼굴 정보가 없습니다</Text>
          </View>
        )}

        {/* 그래프 섹션 */}
        <View style={styles.graphContainer}>
          <Text style={styles.sectionTitle}>확률 분포</Text>
          <View style={styles.barWrap}>
            <View style={[styles.bar, styles.fakeBar, { width: `${graphData.fake}%` }]}>
              <Text style={styles.barLabel}>가짜 {graphData.fake}%</Text>
            </View>
            <View style={[styles.bar, styles.realBar, { width: `${graphData.real}%` }]}>
              <Text style={styles.barLabel}>진짜 {graphData.real}%</Text>
            </View>
          </View>
        </View>

        {/* 액션 버튼들 */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.downloadBtn} onPress={handleDownloadImage}>
            <Ionicons name="download-outline" size={20} color="#fff" />
            <Text style={styles.downloadBtnText}>이미지 저장</Text>
          </TouchableOpacity>

          {!isSafe && (
            <ReportButton onPress={() => setShowReportModal(true)} />
          )}
        </View>
      </ScrollView>

      {/* 신고 모달 */}
      <ReportModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  content: { paddingHorizontal: 20, paddingVertical: 24 },
  imageContainer: {
    width: '100%',
    height: 300,
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f5f5f5',
  },
  uploadedImage: { width: '100%', height: '100%' },
  messageContainer: { marginBottom: 24 },
  messageTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    lineHeight: 32,
  },
  messageDesc: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 20,
  },
  // ✅ 얼굴 결과 스타일
  faceResultsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 12,
  },
  faceCard: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  faceInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  faceId: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111',
  },
  faceStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  faceConfidence: {
    fontSize: 14,
    color: '#666',
  },
  faceImageContainer: {
    alignItems: 'center',
  },
  faceImage: {
    width: width - 88,
    height: 200,
    borderRadius: 8,
    backgroundColor: '#E5E7EB',
  },
  faceImageLabel: {
    fontSize: 12,
    color: '#999',
    marginTop: 8,
  },
  noImageContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
  },
  noImageText: {
    fontSize: 14,
    color: '#999',
  },
  noFaceContainer: {
    padding: 20,
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 8,
    marginBottom: 24,
  },
  noFaceText: {
    fontSize: 14,
    color: '#999',
  },
  graphContainer: { marginBottom: 24 },
  barWrap: { flexDirection: 'column', gap: 8 },
  bar: {
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    paddingHorizontal: 12,
  },
  fakeBar: { backgroundColor: '#FF6B6B' },
  realBar: { backgroundColor: '#4ECDC4' },
  barLabel: { fontSize: 14, fontWeight: '600', color: '#fff' },
  actions: { gap: 12 },
  downloadBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#4ECDC4',
    paddingVertical: 14,
    borderRadius: 12,
    gap: 8,
  },
  downloadBtnText: { fontSize: 16, fontWeight: '600', color: '#fff' },
});