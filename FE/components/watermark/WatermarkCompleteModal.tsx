import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface WatermarkCompleteModalProps {
  visible: boolean;
  onClose: () => void;
  onDownload: () => void;
}

export function WatermarkCompleteModal({
  visible,
  onClose,
  onDownload,
}: WatermarkCompleteModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* 체크 아이콘 */}
          <View style={styles.iconCircle}>
            <View style={styles.iconInner}>
              <Text style={styles.iconText}>✓</Text>
            </View>
          </View>

          {/* 완료 메시지 */}
          <Text style={styles.resultTitle}>
            이미지에 워터마크 추가했어요.
          </Text>
          <Text style={styles.resultSubtitle}>
            자유롭게 사용해보세요!
          </Text>

          {/* 공유하기 버튼 */}
          <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
            <Text style={styles.downloadButtonText}>공유하기</Text>
          </TouchableOpacity>
          {/* 홈으로 돌아가기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={20} color="#FFF" />
            <Text style={styles.closeButtonText}>홈으로 돌아가기</Text>
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
    backgroundColor: 'rgba(76, 217, 100, 0.15)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  iconInner: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: '#4CD964',
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
  downloadButton: {
    width: '100%',
    paddingVertical: 14,
    backgroundColor: '#0071E3',
    borderRadius: 12,
    marginBottom: 12,
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
  closeButton: {
    width: '100%',
    flexDirection: 'row',       // ✅ 추가
    alignItems: 'center',       // ✅ 추가
    justifyContent: 'center',   // ✅ 추가
    paddingVertical: 14,
    backgroundColor: '#111',
    borderRadius: 12,
    gap: 8,                     // ✅ 추가: 아이콘과 텍스트 사이 간격
  },
  closeButtonText: {  // ✅ 추가
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});