import React from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from 'react-native';

interface ProtectionCompleteModalProps {
  visible: boolean;
  onDownload: () => void;
}

export function ProtectionCompleteModal({
  visible,
  onDownload,
}: ProtectionCompleteModalProps) {
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
            이미지에 노이즈를 추가했어요.
          </Text>
          <Text style={styles.resultSubtitle}>
            자유롭게 사용해보세요!
          </Text>

          {/* 다운로드 버튼 */}
          <TouchableOpacity style={styles.downloadButton} onPress={onDownload}>
            <Text style={styles.downloadButtonText}>공유하기</Text>
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
  },
  downloadButtonText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#fff',
    textAlign: 'center',
  },
});