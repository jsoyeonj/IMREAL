// FE/hooks/useImagePicker.ts
import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  type?: string;
  mediaType?: 'image' | 'video';
  duration?: number; 
}

export const useImagePicker = () => {
  const [selectedImage, setSelectedImage] = useState<ImageInfo | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // 갤러리에서 이미지 선택
  const pickImageFromGallery = async () => {
    try {
      setIsLoading(true);

      // 권한 요청
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          '권한 필요',
          '갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return;
      }

      // 이미지 선택 - JPEG로 자동 변환
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['images'], // 새로운 방식 (deprecated 경고 해결)
        allowsEditing: false,
        quality: 0.8,
        // HEIC를 JPEG로 자동 변환하는 옵션
        preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        console.log('📸 선택된 이미지:', image.uri);
        setSelectedImage({
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
          mediaType: 'image',
        });
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };
  const pickVideoFromGallery = async () => {
    try {
      setIsLoading(true);

      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          '권한 필요',
          '갤러리 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return;
      }

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ['videos'],  // ✅ 비디오만 선택
        allowsEditing: false,
        quality: 0.8,
      });

      if (!result.canceled && result.assets[0]) {
        const media = result.assets[0];
        console.log('🎥 선택된 비디오:', media.uri);
        console.log('비디오 길이:', media.duration);
        
        setSelectedImage({
          uri: media.uri,
          width: media.width,
          height: media.height,
          type: media.type,
          mediaType: 'video',
          duration: media.duration ?? 0,
        });
      }
    } catch (error) {
      console.error('비디오 선택 오류:', error);
      Alert.alert('오류', '비디오를 불러오는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 카메라로 사진 촬영
  const takePicture = async () => {
    try {
      setIsLoading(true);

      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      
      if (status !== 'granted') {
        Alert.alert(
          '권한 필요',
          '카메라 접근 권한이 필요합니다. 설정에서 권한을 허용해주세요.',
          [{ text: '확인' }]
        );
        return;
      }

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: false,
        quality: 0.8,
        preferredAssetRepresentationMode: ImagePicker.UIImagePickerPreferredAssetRepresentationMode.Current,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        console.log('📸 촬영된 이미지:', image.uri);
        setSelectedImage({
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
          mediaType: 'image',
        });
      }
    } catch (error) {
      console.error('사진 촬영 오류:', error);
      Alert.alert('오류', '사진을 촬영하는데 실패했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  // 선택한 이미지 초기화
  const clearImage = () => {
    setSelectedImage(null);
  };

  return {
    selectedImage,
    isLoading,
    pickImageFromGallery,
    pickVideoFromGallery,
    takePicture,
    clearImage,
  };
};