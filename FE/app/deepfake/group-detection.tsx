import React from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { View, Text, StyleSheet, Image, ScrollView } from 'react-native';
import { ToggleMode } from '../../components/deepfake/ToggleMode';
import { useImagePicker } from '../../hooks/useImagePicker';
import { ImageUploader } from '../../components/deepfake/ImageUploader';

export default function GroupDeepfakeDetection() {
  const { selectedImage, isLoading, pickImageFromGallery, clearImage } = useImagePicker();

  const handleDetection = () => {
    if (!selectedImage) return;
    console.log('탐지 시작(그룹):', selectedImage.uri);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}><Text style={styles.headerTitle}>그룹 DeepFake 탐지</Text></View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* 토글: 그룹 활성 */}
        <ToggleMode
          active="group"
          routes={{ single: '/deepfake/detection', group: '/deepfake/group-detection' }}
        />

        {/* >>> 보라 일러스트로 교체 <<< */}
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

        {/* >>> 보라 아이콘/라벨로 교체 <<< */}
        <ImageUploader
          selectedImage={selectedImage}
          isLoading={isLoading}
          onPickImage={pickImageFromGallery}
          iconSource={require('../../assets/images/icons/upload-camera-purple.png')}
          label="이미지/영상 업로드"
          iconBg="#EFE7FF"       // 연보라 배경(아이콘 뒤)
        />

        {selectedImage && (
          <View style={styles.actionRow}>
            <Text style={styles.linkBtn} onPress={clearImage}>다시 선택</Text>
            <Text style={styles.primaryBtn} onPress={handleDetection}>탐지 시작</Text>
          </View>
        )}
      </ScrollView>
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
    borderRadius: 14, backgroundColor: '#6C63FF', color: '#fff', fontWeight: '700' // 보라 테마
  },
});
