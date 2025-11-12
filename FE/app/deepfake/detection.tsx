import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';
import { ToggleMode } from '../../components/deepfake/ToggleMode';
import { DetectionLoadingModal } from '../../components/deepfake/DetectionLoadingModal';
import { DetectionResultModal } from '../../components/deepfake/DetectionResultModal';

export default function DeepfakeDetection() {
  const router = useRouter();
  const {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    clearImage,
  } = useImagePicker();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [detectionResult, setDetectionResult] = useState<boolean>(true); // true: 안전, false: 위험

  const handleDetection = () => {
    if (!selectedImage) return;
    console.log('탐지 시작:', selectedImage.uri);
    
    // 로딩 모달 표시
    setShowLoadingModal(true);
    
    // 랜덤 결과 생성 (50% 확률)
    const randomResult = Math.random() > 0.5;
    setDetectionResult(randomResult);
    
    // 5초 후 로딩 닫고 결과 표시
    setTimeout(() => {
      setShowLoadingModal(false);
      setShowResultModal(true);
    }, 5000);
  };

  const handleCancelDetection = () => {
    setShowLoadingModal(false);
    console.log('탐지 취소됨');
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    console.log('결과 모달 닫힘');
  };

  const handleViewDetail = () => {
    // 상세 페이지로 이동
    router.push({
      pathname: '/deepfake/result',
      params: {
        imageUri: selectedImage?.uri || '',
        isSafe: detectionResult.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DeepFake 탐지</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 모드 토글 (싱글 활성) */}
        <ToggleMode
          active="single"
          routes={{ single: '/deepfake/detection', group: '/deepfake/group-detection' }}
        />

        {/* 일러스트 */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../assets/images/illustrations/deepfake-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* 타이틀 & 설명 */}
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>이미지로부터{'\n'}Deepfake 탐지</Text>
          <Text style={styles.description}>
            업로드한 이미지에서 사람을 찾아내고,{'\n'}
            찾아낸 사람이 deepfake인지 탐지합니다.
          </Text>
        </View>

        {/* 업로드(1버튼) + 미리보기 */}
        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImageFromGallery}
        />

        {/* 선택 후에만 노출되는 액션 (필요 최소) */}
        {selectedImage && (
          <View style={styles.actionRow}>
            <Text style={styles.linkBtn} onPress={clearImage}>다시 선택</Text>
            <Text style={styles.primaryBtn} onPress={handleDetection}>탐지 시작</Text>
          </View>
        )}
      </ScrollView>

      {/* 로딩 모달 - 싱글 모드 (청록색) */}
      <DetectionLoadingModal
        visible={showLoadingModal}
        onCancel={handleCancelDetection}
        mode="single"
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  illustrationWrap: { alignItems: 'center', marginBottom: 16 },
  illustrationImage: { width: 260, height: 260 },
  textSection: { alignItems: 'center', marginBottom: 24 },
  mainTitle: { fontSize: 28, fontWeight: '800', color: '#111', textAlign: 'center', lineHeight: 36 },
  description: { fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 20 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  linkBtn: {
    flex: 1, textAlign: 'center', paddingVertical: 14,
    borderRadius: 14, backgroundColor: '#F3F4F6', color: '#444', fontWeight: '600'
  },
  primaryBtn: {
    flex: 1.2, textAlign: 'center', paddingVertical: 14,
    borderRadius: 14, backgroundColor: '#4ECDC4', color: '#fff', fontWeight: '700'
  },
});