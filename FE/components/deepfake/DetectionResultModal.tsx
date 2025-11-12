import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
} from 'react-native';

interface DetectionResultModalProps {
  visible: boolean;
  onClose: () => void;
  onViewDetail: () => void; // 자세히 보기 버튼 핸들러 추가
  isSafe: boolean;
}

export function DetectionResultModal({
  visible,
  onClose,
  onViewDetail,
  isSafe,
}: DetectionResultModalProps) {
  const handleViewDetail = () => {
    onClose(); // 모달 닫고
    onViewDetail(); // 상세 페이지로 이동
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* 결과 아이콘 */}
          <View
            style={[
              styles.iconCircle,
              {
                backgroundColor: isSafe
                  ? 'rgba(76, 217, 100, 0.15)'
                  : 'rgba(255, 107, 107, 0.15)',
              },
            ]}
          >
            <View
              style={[
                styles.iconInner,
                { backgroundColor: isSafe ? '#4CD964' : '#FF6B6B' },
              ]}
            >
              {isSafe ? (
                // 체크 아이콘
                <Text style={styles.iconText}>✓</Text>
              ) : (
                // X 아이콘
                <Text style={styles.iconText}>✕</Text>
              )}
            </View>
          </View>

          {/* 결과 메시지 */}
          <Text style={styles.resultTitle}>
            {isSafe
              ? 'Deepfake가 탐지되지 않았어요!'
              : 'Deepfake가 탐지되었어요!'}
          </Text>
          <Text style={styles.resultSubtitle}>
            {isSafe ? '안전한 이미지에요!' : '주의가 필요해요!'}
          </Text>

          {/* 자세히 보기 버튼 */}
          <TouchableOpacity style={styles.detailButton} onPress={handleViewDetail}>
            <Text style={styles.detailButtonText}>자세히 보기</Text>
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
  iconCircle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    justifyContent: 'center',
    alignItems: 'center',
  },
  iconText: {
    fontSize: 80,
    fontWeight: '700',
    color: '#fff',
  },
  resultTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111',
    textAlign: 'center',
    marginBottom: 8,
  },
  resultSubtitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
    textAlign: 'center',
    marginBottom: 28,
  },
  detailButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#0071E3',
    borderRadius: 12,
  },
  detailButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});