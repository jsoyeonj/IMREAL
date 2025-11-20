// FE/app/deepfake/detection.tsx
// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';
import { ToggleMode } from '../../components/deepfake/ToggleMode';
import { DetectionLoadingModal } from '../../components/deepfake/DetectionLoadingModal';
import { DetectionResultModal } from '../../components/deepfake/DetectionResultModal';
import { analyzeImage, analyzeVideo } from '../../services/deepfakeApi';
import { useAuth } from '../../contexts/AuthContext';
import * as ImageManipulator from 'expo-image-manipulator';

export default function DeepfakeDetection() {
  const router = useRouter();
  const { token } = useAuth();
  
  const {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    pickVideoFromGallery,
    clearImage,
  } = useImagePicker();

  const [showLoadingModal, setShowLoadingModal] = useState(false);
  const [showResultModal, setShowResultModal] = useState(false);
  const [detectionResult, setDetectionResult] = useState<boolean>(true);
  const [faceResults, setFaceResults] = useState([]);
  const [mediaMode, setMediaMode] = useState<'image' | 'video'>('image');

  const handleUploadClick = () => {
    if (mediaMode === 'image') {
      pickImageFromGallery();
    } else {
      pickVideoFromGallery();
    }
  };

  const handleDetection = async () => {
    if (!selectedImage) return;
    
    if (!token) {
      Alert.alert('로그인 필요', '로그인 후 이용해주세요', [
        { text: '확인', onPress: () => router.push('/login') }
      ]);
      return;
    }
    
    setShowLoadingModal(true);
    
    try {
      if (selectedImage.mediaType === 'video') {
        console.log('🎥 비디오 분석 시작:', selectedImage.uri);
        const result = await analyzeVideo(selectedImage.uri, token);
        
        if (result.success) {
          const hasDeepfake = result.faceResults?.some(face => face.is_deepfake) || false;
          const isSafe = !hasDeepfake;
          
          setDetectionResult(isSafe);
          setFaceResults(result.faceResults || []);
          
          setShowLoadingModal(false);
          setShowResultModal(true);
          
          console.log('✅ 비디오 분석 완료:', {
            isSafe,
            faceCount: result.faceCount,
            faces: result.faceResults
          });
        } else {
          setShowLoadingModal(false);
          Alert.alert('분석 실패', result.error || '다시 시도해주세요');
        }
        
      } else {
        let imageUri = selectedImage.uri;
        
        if (imageUri.toLowerCase().endsWith('.heic') || imageUri.toLowerCase().endsWith('.heif')) {
          console.log('🔄 HEIC → JPEG 변환 시작');
          
          const manipResult = await ImageManipulator.manipulateAsync(
            imageUri,
            [],
            { 
              compress: 0.8, 
              format: ImageManipulator.SaveFormat.JPEG 
            }
          );
          
          imageUri = manipResult.uri;
          console.log('✅ JPEG 변환 완료:', imageUri);
        }
        
        console.log('🔍 이미지 분석 시작:', imageUri);
        
        const result = await analyzeImage(imageUri, token);
        
        if (result.success) {
          const hasDeepfake = result.faceResults?.some(face => face.is_deepfake) || false;
          const isSafe = !hasDeepfake;
          
          setDetectionResult(isSafe);
          setFaceResults(result.faceResults || []);
          
          setShowLoadingModal(false);
          setShowResultModal(true);
          
          console.log('✅ 이미지 분석 완료:', {
            isSafe,
            faceCount: result.faceCount,
            faces: result.faceResults
          });
        } else {
          setShowLoadingModal(false);
          Alert.alert('분석 실패', result.error || '다시 시도해주세요');
        }
      }
      
    } catch (error) {
      setShowLoadingModal(false);
      Alert.alert('오류', '분석 중 문제가 발생했습니다');
      console.error('❌ 분석 오류:', error);
    }
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
    router.push({
      pathname: '/deepfake/result',
      params: {
        imageUri: selectedImage?.uri || '',
        isSafe: detectionResult.toString(),
        faceResults: JSON.stringify(faceResults),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>DeepFake 탐지</Text>
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <ToggleMode
          active="single"
          routes={{ single: '/deepfake/detection', group: '/deepfake/group-detection' }}
        />

        <View style={styles.mediaToggle}>
          <TouchableOpacity
            style={[styles.toggleButton, mediaMode === 'image' && styles.toggleButtonActive]}
            onPress={() => {
              setMediaMode('image');
              clearImage();
            }}
          >
            <Text style={[styles.toggleText, mediaMode === 'image' && styles.toggleTextActive]}>
              이미지
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.toggleButton, mediaMode === 'video' && styles.toggleButtonActive]}
            onPress={() => {
              setMediaMode('video');
              clearImage();
            }}
          >
            <Text style={[styles.toggleText, mediaMode === 'video' && styles.toggleTextActive]}>
              영상
            </Text>
          </TouchableOpacity>
        </View>

        <View style={styles.illustrationWrap}>
          <Image
            source={require('../../assets/images/illustrations/deepfake-illustration.png')}
            style={styles.illustrationImage}
            resizeMode="contain"
          />
        </View>

        <View style={styles.textSection}>
          <Text style={styles.mainTitle}>
            {mediaMode === 'image' ? '이미지로부터' : '영상으로부터'}{'\n'}Deepfake 탐지
          </Text>
          <Text style={styles.description}>
            업로드한 {mediaMode === 'image' ? '이미지' : '영상'}에서 사람을 찾아내고,{'\n'}
            찾아낸 사람이 deepfake인지 탐지합니다.
          </Text>
        </View>

        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={handleUploadClick}
          label={mediaMode === 'image' ? '이미지 업로드' : '영상 업로드'}
        />

        {selectedImage && (
          <View style={styles.actionRow}>
            <Text style={styles.linkBtn} onPress={clearImage}>다시 선택</Text>
            <Text style={styles.primaryBtn} onPress={handleDetection}>탐지 시작</Text>
          </View>
        )}
      </ScrollView>

      <DetectionLoadingModal
        visible={showLoadingModal}
        onCancel={handleCancelDetection}
        mode="single"
        mediaType={selectedImage?.mediaType || 'image'}
      />

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
  mediaToggle: {
    flexDirection: 'row',
    backgroundColor: '#F3F4F6',
    borderRadius: 12,
    padding: 4,
    marginBottom: 24,
  },
  toggleButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 10,
  },
  toggleButtonActive: {
    backgroundColor: '#4ECDC4',
  },
  toggleText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  toggleTextActive: {
    color: '#fff',
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
    backgroundColor: '#4ECDC4', 
    color: '#fff', 
    fontWeight: '700'
  },
});