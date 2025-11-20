// FE/app/watermark/add-watermark.tsx
// @ts-nocheck
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  ScrollView, 
  Alert,
  TextInput,
  TouchableOpacity 
} from 'react-native';
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
  
  // ✅ 워터마크 텍스트 입력 상태 추가
  const [watermarkText, setWatermarkText] = useState('IMREAL 2025');

  const handleAddWatermark = async () => {
    if (!selectedImage) return;
    
    // ✅ 로그인 확인
    if (!token) {
      Alert.alert('로그인 필요', '로그인 후 이용해주세요', [
        { text: '확인', onPress: () => router.push('/login') }
      ]);
      return;
    }

    // ✅ 워터마크 텍스트 유효성 검사
    if (!watermarkText.trim()) {
      Alert.alert('입력 필요', '워터마크 텍스트를 입력해주세요');
      return;
    }
    
    console.log('🔒 워터마크 추가 시작:', {
      imageUri: selectedImage.uri,
      watermarkText: watermarkText.trim()
    });
    setShowLoadingModal(true);
    
    try {
      // ✅ 백엔드 API 호출 (watermarkText 전달)
      const result: any = await addWatermark(
        selectedImage.uri, 
        token, 
        'watermark',
        watermarkText.trim()  // ← 입력받은 텍스트 전달
      );
      
      if (result.success) {
        console.log('✅ 워터마크 추가 완료:', {
          jobId: result.jobId,
          status: result.status,
          filesCount: result.protectedFiles?.length || 0
        });
        
        // 워터마크가 추가된 이미지 URL 저장
        if (result.protectedFiles && result.protectedFiles.length > 0) {
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
    const imageToShare = watermarkedImageUrl || selectedImage?.uri;
    
    if (!imageToShare) return;
    
    try {
      if (Platform.OS === 'ios') {
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

        {/* ✅ 워터마크 텍스트 입력 섹션 추가 */}
        <View style={styles.inputSection}>
          <Text style={styles.inputLabel}>워터마크 텍스트</Text>
          <TextInput
            style={styles.textInput}
            value={watermarkText}
            onChangeText={setWatermarkText}
            placeholder="워터마크로 사용할 텍스트 입력 (예: IMREAL 2025)"
            placeholderTextColor="#999"
            maxLength={50}
          />
          <Text style={styles.inputHint}>
            * 최대 50자까지 입력 가능합니다
          </Text>
        </View>

        {/* 이미지 업로더 */}
        {/* @ts-ignore */}
        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImageFromGallery}
          onClearImage={clearImage}
          accentColor="#9333EA"
        />

        {/* 워터마크 추가 버튼 */}
        {selectedImage && (
          <TouchableOpacity 
            style={styles.watermarkButton}
            onPress={handleAddWatermark}
          >
            <Text style={styles.watermarkButtonText}>워터마크 추가하기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      {/* 로딩 모달 */}
      <WatermarkLoadingModal
        visible={showLoadingModal}
        onCancel={handleCancelWatermark}
      />

      {/* 완료 모달 */}
      {/* @ts-ignore */}
      <WatermarkCompleteModal
        visible={showCompleteModal}
        onClose={() => {
          setShowCompleteModal(false);
          router.push('/home');
        }}
        onDownload={handleDownload}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
  },
  illustrationWrap: {
    alignItems: 'center',
    marginBottom: 16,
  },
  illustrationImage: {
    width: 160,
    height: 160,
  },
  textSection: {
    marginBottom: 24,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 12,
    lineHeight: 32,
  },
  description: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 22,
  },
  // ✅ 입력 섹션 스타일 추가
  inputSection: {
    marginBottom: 24,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    backgroundColor: '#F9FAFB',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    marginBottom: 8,
  },
  inputHint: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  watermarkButton: {
    backgroundColor: '#9333EA',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 20,
  },
  watermarkButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});