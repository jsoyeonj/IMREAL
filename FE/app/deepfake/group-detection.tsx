import React, { useState } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { ToggleMode } from '../../components/deepfake/ToggleMode';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';
import { DetectionLoadingModal } from '../../components/deepfake/DetectionLoadingModal';
import { DetectionResultModal } from '../../components/deepfake/DetectionResultModal';

export default function GroupDeepfakeDetection() {
  const router = useRouter();
  const { selectedImage, isLoading, pickImageFromGallery, clearImage } = useImagePicker();
  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [detectionResult, setDetectionResult] = useState<boolean>(true);

  const handleDetection = () => {
    if (!selectedImage) return;
    console.log('탐지 시작(그룹):', selectedImage.uri);
    
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
    console.log('그룹 탐지 취소됨');
  };

  const handleCloseResult = () => {
    setShowResultModal(false);
    console.log('그룹 결과 모달 닫힘');
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
            style={{ width: 260, height: 260 }}
            resizeMode="contain"
          />
        </View>

        <View style={{ alignItems: 'center', marginBottom: 24 }}>
          <Text style={{ fontSize: 28, fontWeight: '800', color: '#111', textAlign: 'center', lineHeight: 36 }}>
            다중 사람 이미지로부터{'\n'}Deepfake 탐지
          </Text>
          <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginTop: 10, lineHeight: 20 }}>
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

        {selectedImage && (
          <View style={styles.actionRow}>
            <Text style={styles.linkBtn} onPress={clearImage}>다시 선택</Text>
            <Text style={styles.primaryBtn} onPress={handleDetection}>탐지 시작</Text>
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
  container: { flex: 1, backgroundColor: '#fff' },
  header: { paddingHorizontal: 20, paddingVertical: 16, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#000' },
  content: { paddingHorizontal: 20, paddingTop: 24, paddingBottom: 40 },
  illustrationWrap: { alignItems: 'center', marginBottom: 16 },

  actionRow: { flexDirection: 'row', gap: 12, marginTop: 20 },
  linkBtn: {
    flex: 1, textAlign: 'center', paddingVertical: 14,
    borderRadius: 14, backgroundColor: '#F3F4F6', color: '#444', fontWeight: '600'
  },
  primaryBtn: {
    flex: 1.2, textAlign: 'center', paddingVertical: 14,
    borderRadius: 14, backgroundColor: '#6C63FF', color: '#fff', fontWeight: '700'
  },
});