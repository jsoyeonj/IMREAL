// FE/app/watermark/add-watermark.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';
import { WatermarkLoadingModal } from '../../components/watermark/WatermarkLoadingModal';
import { WatermarkCompleteModal } from '../../components/watermark/WatermarkCompleteModal';
import { useAuth } from '../../contexts/AuthContext';
import { addWatermark } from '../../services/watermarkApi';
import * as Sharing from 'expo-sharing';
import { Platform } from 'react-native';

export default function AddWatermark() {
  const router = useRouter();
  const { token } = useAuth();
  const {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    clearImage,
  } = useImagePicker();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showCompleteModal, setShowCompleteModal] = useState(false);
  const [watermarkedImageUrl, setWatermarkedImageUrl] = useState<string | null>(null);

  const handleAddWatermark = async () => {
    if (!selectedImage) return;
    
    // ✅ 로그인 확인
    if (!token) {
      Alert.alert('로그인 필요', '로그인 후 이용해주세요', [
        { text: '확인', onPress: () => router.push('/login') }
      ]);
      return;
    }
    
    console.log('🔒 워터마크 추가 시작:', selectedImage.uri);
    setShowLoadingModal(true);
    
    try {
      // ✅ 백엔드 API 호출 (job_type: 'watermark')
      const result: any = await addWatermark(selectedImage.uri, token, 'watermark');
      
      if (result.success) {
        console.log('✅ 워터마크 추가 완료:', {
          jobId: result.jobId,
          status: result.status,
          filesCount: result.protectedFiles?.length || 0
        });
        
        // 워터마크가 추가된 이미지 URL 저장
        if (result.protectedFiles && result.protectedFiles.length > 0) {
          // 'Watermark' 타입의 파일 찾기
          const watermarkFile = result.protectedFiles.find(
            (file: any) => file.request_version === 'Watermark'
          );
          
          if (watermarkFile && watermarkFile.ResultUrl) {
            setWatermarkedImageUrl(watermarkFile.ResultUrl);
            console.log('📥 워터마크 이미지 URL:', watermarkFile.ResultUrl);
          }
        }
        
        setShowLoadingModal(false);
        setShowCompleteModal(true);
      } else {
        setShowLoadingModal(false);
        Alert.alert('워터마크 추가 실패', result.error || '다시 시도해주세요');
      }
      
    } catch (error) {
      setShowLoadingModal(false);
      Alert.alert('오류', '워터마크 추가 중 문제가 발생했습니다');
      console.error('❌ 워터마크 추가 오류:', error);
    }
  };

  const handleCancelWatermark = () => {
    setShowLoadingModal(false);
    console.log('워터마크 추가 취소됨');
  };

  const handleDownload = async () => {
    // 워터마크가 추가된 이미지 URL이 있으면 그것을 사용, 없으면 원본 사용
    const imageToShare = watermarkedImageUrl || selectedImage?.uri;
    
    if (!imageToShare) return;
    
    try {
      if (Platform.OS === 'ios') {
        // ✅ iOS: 공유 메뉴 사용
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (!isAvailable) {
          Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
          return;
        }

        await Sharing.shareAsync(imageToShare, {
          mimeType: 'image/jpeg',
          dialogTitle: '워터마크가 추가된 이미지 저장하기',
        });

        console.log('✅ iOS 공유 완료');
      } else {
        // ✅ Android: 공유 메뉴 사용 (또는 직접 저장 구현 가능)
        const isAvailable = await Sharing.isAvailableAsync();
        
        if (isAvailable) {
          await Sharing.shareAsync(imageToShare, {
            mimeType: 'image/jpeg',
            dialogTitle: '워터마크가 추가된 이미지 저장하기',
          });
          console.log('✅ Android 공유 완료');
        } else {
          Alert.alert('공유 불가', '이 기기에서는 공유 기능을 사용할 수 없습니다.');
        }
      }
      
      // 모달 닫고 홈으로
      setShowCompleteModal(false);
      router.push('/home');
      
    } catch (error) {
      console.error('❌ 공유 실패:', error);
      Alert.alert('공유 실패', '이미지 공유 중 오류가 발생했습니다.');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* 상단 헤더 */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>워터마크 추가</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 일러스트 */}
        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../assets/images/illustrations/watermark-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        {/* 타이틀 & 설명 */}
        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>이미지에{'\n'}워터마크 추가하기</Text>
          <Text style={styles.description}>
            보이지 않는 자신 만의 표시를 추가하여,{'\n'}
            무단 이미지 사용으로부터 보호하세요!
          </Text>
        </View>

        {/* 업로드 버튼 */}
        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImageFromGallery}
          iconSource={require('../../assets/images/icons/upload-camera-purple.png')}
          label="이미지 업로드"
          iconBg="#F3E8FF"
        />

        {/* 선택 후에만 노출되는 액션 */}
        {selectedImage && (
          <View style={styles.actionRow}>
            <Text style={styles.linkBtn} onPress={clearImage}>다시 선택</Text>
            <Text style={styles.primaryBtn} onPress={handleAddWatermark}>워터마크 추가</Text>
          </View>
        )}
      </ScrollView>

      {/* 로딩 모달 */}
      <WatermarkLoadingModal
        visible={showLoadingModal}
        onCancel={handleCancelWatermark}
      />

      {/* 완료 모달 */}
      <WatermarkCompleteModal
        visible={showCompleteModal}
        onDownload={handleDownload}
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
  linkBtn: {
    flex: 1, 
    textAlign: 'center', 
    paddingVertical: 14,
    borderRadius: 14, 
    backgroundColor: '#F3F4F6', 
    color: '#444', 
    fontWeight: '600'
  },
  primaryBtn: {
    flex: 1.2, 
    textAlign: 'center', 
    paddingVertical: 14,
    borderRadius: 14, 
    backgroundColor: '#7C3AED', 
    color: '#fff', 
    fontWeight: '700'
  },
});