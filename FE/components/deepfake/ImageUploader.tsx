import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, ActivityIndicator, ImageSourcePropType } from 'react-native';
import { Video ,ResizeMode } from 'expo-av'; 

interface ImageUploaderProps {
  selectedImage: { uri: string; width: number; height: number; mediaType?: 'image' | 'video'; duration?: number;  } | null;
  isLoading: boolean;
  onPickImage: () => void;

  // ▼ 추가: 테마 커스터마이즈
  iconSource?: ImageSourcePropType;  // 버튼 아이콘
  label?: string;                    // 버튼 라벨
  buttonColor?: string;              // 버튼 배경색
  iconBg?: string;                   // 아이콘 뒷배경색(연한)
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({
  selectedImage,
  isLoading,
  onPickImage,
  iconSource,
  label = '이미지 업로드',
  buttonColor = '#4ECDC4',
  iconBg = '#E6F6F4',
}) => {
  return (
    <View style={styles.container}>
      {/* 선택된 경우에만 미리보기 표시 */}
      {selectedImage && (
        <View style={styles.previewBox}>
          {selectedImage.mediaType === 'video' ? (
            <>
              <Video
                source={{ uri: selectedImage.uri }}
                style={styles.previewImage}
                useNativeControls
                resizeMode={ResizeMode.CONTAIN}
                isLooping
              />
              <Text style={styles.previewText}>
                비디오가 선택되었습니다 ({Math.round((selectedImage.duration || 0) / 1000)}초)
              </Text>
            </>
          ) : (
            <>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} resizeMode="cover" />
              <Text style={styles.previewText}>이미지가 선택되었습니다</Text>
            </>
          )}
        </View>
      )}


      {/* 업로드 버튼 */}
      <TouchableOpacity
        style={[styles.uploadButton, { backgroundColor: 'transparent' }]} // 바탕 투명, 아이콘만 강조
        onPress={onPickImage}
        disabled={isLoading}
        activeOpacity={0.8}
      >
        <View style={[styles.iconWrap, { backgroundColor: iconBg }]}>
          <Image
            source={
              iconSource ??
              require('../../assets/images/icons/upload-camera-teal.png') // 기본(단일) 아이콘
            }
            style={styles.iconImage}
            resizeMode="contain"
          />
        </View>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <Text style={[styles.uploadLabel, { color: '#111' }]}>{label}</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { width: '100%', alignItems: 'center' },

  previewBox: { width: '100%', alignItems: 'center', marginBottom: 24 },
  previewImage: { width: '100%', height: 260, borderRadius: 16, backgroundColor: '#F3F4F6' },
  previewText: { marginTop: 12, fontSize: 14, color: '#6C63FF', fontWeight: '700' }, // 보라와도 어울림

  uploadButton: { alignItems: 'center', justifyContent: 'center' },
  iconWrap: {
    width: 72, height: 72, borderRadius: 16,
    alignItems: 'center', justifyContent: 'center',
    shadowColor: '#000', shadowOpacity: 0.08, shadowOffset: { width: 0, height: 4 }, shadowRadius: 8, elevation: 3
  },
  iconImage: { width: 40, height: 40 },
  uploadLabel: { marginTop: 8, fontSize: 14, fontWeight: '700' },
});
