import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';
import { ProtectionLoadingModal } from '../../components/protection/ProtectionLoadingModal';
import { ProtectionCompleteModal } from '../../components/protection/ProtectionCompleteModal';
import * as Sharing from 'expo-sharing';

export default function ImageProtection() {
  const router = useRouter();
  const {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    clearImage,
  } = useImagePicker();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);

  const handleProtection = () => {
    if (!selectedImage) return;
    console.log('이미지 보호 시작:', selectedImage.uri);
    
    // 로딩 모달 표시
    setShowLoadingModal(true);
    
    // 5초 후 로딩 닫고 완료 표시
    setTimeout(() => {
      setShowLoadingModal(false);
      setShowCompleteModal(true);
    }, 5000);
  };

  const handleCancelProtection = () => {
    setShowLoadingModal(false);
    console.log('이미지 보호 취소됨');
  };

  const handleDownload = async () => {
    if (!selectedImage) return;
    
    try {
      // Expo Sharing 사용 (Expo Go에서 작동)
      const isAvailable = await Sharing.isAvailableAsync();
      
      if (!isAvailable) {
        Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        return;
      }

      // 공유 메뉴 열기 (사용자가 다운로드 폴더 선택 가능)
      await Sharing.shareAsync(selectedImage.uri, {
        mimeType: 'image/jpeg',
        dialogTitle: '보호된 이미지 저장하기',
      });

      console.log('공유 완료');
      
      // 모달 닫고 홈으로
      setShowCompleteModal(false);
      router.push('/home');
      
    } catch (error) {
      console.error('공유 실패:', error);
      Alert.alert('공유 실패', '이미지 공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>이미지 보호</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 일러스트 */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../assets/images/illustrations/protection-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* 타이틀 & 설명 */}
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>Deepfake로부터{'\n'}이미지 보호하기</Text>
          <Text style={styles.description}>
            이미지에 미세한 노이즈를 추가하여{'\n'}
            Deepfake가 이미지를 파악하지 못하도록 보호하세요.
          </Text>
        </View>

        {/* 업로드 버튼 */}
        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImageFromGallery}
          iconSource={require('../../assets/images/icons/upload-camera-teal.png')}
          label="이미지 업로드"
          iconBg="#E6F6F4"
        />

        {/* 선택 후에만 노출되는 액션 */}
        {selectedImage && (
          <View style={styles.actionRow}>
            <Text style={styles.linkBtn} onPress={clearImage}>다시 선택</Text>
            <Text style={styles.primaryBtn} onPress={handleProtection}>보호 시작</Text>
          </View>
        )}
      </ScrollView>

      {/* 로딩 모달 */}
      <ProtectionLoadingModal
        visible={showLoadingModal}
        onCancel={handleCancelProtection}
      />

      {/* 완료 모달 */}
      <ProtectionCompleteModal
        visible={showCompleteModal}
        onDownload={handleDownload}
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