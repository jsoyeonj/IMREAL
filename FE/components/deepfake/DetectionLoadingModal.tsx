import React, { useEffect, useRef } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
} from 'react-native';

interface DetectionLoadingModalProps {
  visible: boolean;
  onCancel: () => void;
  mode?: 'single' | 'group'; // 싱글(청록) vs 그룹(보라)
}

export function DetectionLoadingModal({
  visible,
  onCancel,
  mode = 'single',
}: DetectionLoadingModalProps) {
  const progressAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (visible) {
      // 모달이 열릴 때마다 초기화 후 5초 애니메이션 시작
      progressAnim.setValue(0);
      Animated.timing(progressAnim, {
        toValue: 1,
        duration: 5000, // 5초
        useNativeDriver: false,
      }).start();
    }
  }, [visible, progressAnim]);

  // 프로그레스 바 너비 계산 (0% → 100%)
  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  // 모드에 따른 색상
  const barColor = mode === 'group' ? '#6C63FF' : '#4ECDC4';

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* 프로그레스 바 컨테이너 */}
          <View style={styles.progressContainer}>
            <Animated.View
              style={[
                styles.progressBar,
                { backgroundColor: barColor, width: progressWidth },
              ]}
            />
          </View>

          {/* 메시지 */}
          <Text style={styles.message}>이미지를 분석 중이에요.....</Text>

          {/* 취소 버튼 */}
          <TouchableOpacity style={styles.cancelButton} onPress={onCancel}>
            <Text style={styles.cancelButtonText}>취소</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  modalCard: {
    width: '100%',
    maxWidth: 400,
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 32,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  progressContainer: {
    width: '100%',
    height: 16,
    backgroundColor: '#F3F4F6',
    borderRadius: 99,
    overflow: 'hidden',
    marginBottom: 24,
  },
  progressBar: {
    height: '100%',
    borderRadius: 99,
  },
  message: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    textAlign: 'center',
    marginBottom: 28,
  },
  cancelButton: {
    paddingVertical: 12,
    paddingHorizontal: 40,
    backgroundColor: '#0071E3',
    borderRadius: 12,
  },
  cancelButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
  },
});