// FE/app/deepfake/group-detection.tsx
// @ts-nocheck
import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ToggleMode } from '../../components/deepfake/ToggleMode';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';
import { DetectionLoadingModal } from '../../components/deepfake/DetectionLoadingModal';
import { DetectionResultModal } from '../../components/deepfake/DetectionResultModal';
import { analyzeVideo } from '../../services/deepfakeApi';
import { useAuth } from '../../contexts/AuthContext';

export default function GroupDeepfakeDetection() {
  const router = useRouter();
  const { token } = useAuth();
  
  const { selectedImage, isLoading, pickImageFromGallery, clearImage } = useImagePicker();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [detectionResult, setDetectionResult] = useState<boolean>(true);
  const [faceResults, setFaceResults] = useState([]); // ✅ 얼굴 결과 저장

  const handleDetection = async () => {
    if (!selectedImage) return;
    
    // 로그인 확인
    if (!token) {
      Alert.alert('로그인 필요', '로그인 후 이용해주세요', [
        { text: '확인', onPress: () => router.push('/login') }
      ]);
      return;
    }
    
    console.log('🎥 그룹 탐지 시작:', selectedImage.uri);
    setShowLoadingModal(true);
    
    try {
      // 백엔드 API 호출 (영상 분석)
      const result = await analyzeVideo(selectedImage.uri, token);
      
      console.log('📦 API 응답 전체:', result);
      
      if (result.success) {
        // ✅ 얼굴 결과 저장
        setFaceResults(result.faceResults || []);
        
        // ✅ 평균 딥페이크 확률로 안전 여부 판단
        const faceScores = result.faceResults || [];
        const avgFakeRate = faceScores.length > 0 
          ? faceScores.reduce((sum, face) => sum + (face.rate || 0), 0) / faceScores.length 
          : 0;
        const isSafe = avgFakeRate < 0.5;
        
        setDetectionResult(isSafe);
        setShowLoadingModal(false);
        setShowResultModal(true);
        
        console.log('✅ 그룹 분석 완료:', {
          isSafe,
          faceCount: result.faceCount,
          faceResults: result.faceResults
        });
      } else {
        setShowLoadingModal(false);
        Alert.alert('분석 실패', result.error || '다시 시도해주세요');
      }
      
    } catch (error) {
      setShowLoadingModal(false);
      Alert.alert('오류', '분석 중 문제가 발생했습니다');
      console.error('❌ 그룹 분석 오류:', error);
    }
  };

  const handleCancelDetection = () => {
    setShowLoadingModal(false);
    console.log('그룹 탐지 취소됨');
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    console.log('그룹 결과 모달 닫힘');
  };

  const handleViewDetail = () => {
    // ✅ 얼굴 결과와 함께 result 페이지로 이동
    router.push({
      pathname: '/deepfake/result',
      params: {
        imageUri: selectedImage?.uri || '',
        mediaType: 'image', // 또는 'video'
        faceResults: JSON.stringify(faceResults), // ✅ 얼굴 결과 전달
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>그룹 DeepFake 탐지</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 토글: 그룹 활성 */}
        <ToggleMode
          active="group"
          routes={{ single: '/deepfake/detection', group: '/deepfake/group-detection' }}
        />

        {/* 보라 일러스트 */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../assets/images/illustrations/group-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* 타이틀 & 설명 */}
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>
            다중 사람 이미지로부터{'\n'}Deepfake 탐지
          </Text>
          <Text style={styles.description}>
            업로드한 이미지에서 사람을 찾아내고,{'\n'}
            찾아낸 사람이 deepfake인지 탐지합니다.
          </Text>
        </View>

        {/* 보라 아이콘/라벨 */}
        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImageFromGallery}
          iconSource={require('../../assets/images/icons/upload-camera-purple.png')}
          label="이미지/영상 업로드"
          iconBg="#EFE7FF"
        />

        {/* 선택 후에만 노출되는 액션 */}
        {selectedImage && (
          <View style={styles.actionRow}>
            <TouchableOpacity 
              style={styles.reselectButton}
              onPress={clearImage}
            >
              <Text style={styles.reselectButtonText}>다시 선택</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={styles.detectButton}
              onPress={handleDetection}
            >
              <Text style={styles.detectButtonText}>탐지 시작</Text>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      {/* 로딩 모달 - 그룹 모드 (보라색) */}
      <DetectionLoadingModal
        visible={showLoadingModal}
        onCancel={handleCancelDetection}
        mode="group"
      />

      {/* 결과 모달 */}
      <DetectionResultModal
        visible={showResultModal}
        onClose={handleCloseResult}
        onViewDetail={handleViewDetail}
        isSafe={detectionResult}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#fff' 
  },
  header: { 
    paddingHorizontal: 20, 
    paddingVertical: 16, 
    borderBottomWidth: 1, 
    borderBottomColor: '#f0f0f0' 
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#000' 
  },
  content: { 
    paddingHorizontal: 20, 
    paddingTop: 24, 
    paddingBottom: 40 
  },
  illustrationWrap: { 
    alignItems: 'center', 
    marginBottom: 16 
  },
  illustrationImage: { 
    width: 260, 
    height: 260 
  },
  textSection: { 
    alignItems: 'center', 
    marginBottom: 24 
  },
  mainTitle: { 
    fontSize: 28, 
    fontWeight: '800', 
    color: '#111', 
    textAlign: 'center', 
    lineHeight: 36 
  },
  description: { 
    fontSize: 14, 
    color: '#666', 
    textAlign: 'center', 
    marginTop: 10, 
    lineHeight: 20 
  },
  actionRow: { 
    flexDirection: 'row', 
    gap: 12, 
    marginTop: 20 
  },
  reselectButton: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  reselectButtonText: {
    color: '#444',
    fontSize: 16,
    fontWeight: '600',
  },
  detectButton: {
    flex: 1.2,
    backgroundColor: '#6C63FF',  // 보라색 유지
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  detectButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});