import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Alert } from 'react-native';

interface ImageInfo {
  uri: string;
  width: number;
  height: number;
  type?: string;
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

      // 이미지 선택
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: false,
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        setSelectedImage({
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
        });
      }
    } catch (error) {
      console.error('이미지 선택 오류:', error);
      Alert.alert('오류', '이미지를 불러오는데 실패했습니다.');
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
        quality: 1,
      });

      if (!result.canceled && result.assets[0]) {
        const image = result.assets[0];
        setSelectedImage({
          uri: image.uri,
          width: image.width,
          height: image.height,
          type: image.type,
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
    takePicture,
    clearImage,
  };
};