// FE/components/profile/ProfileImageModal.tsx
import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  StyleSheet,
  Pressable,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ProfileImageModalProps {
  visible: boolean;
  onClose: () => void;
  onSelectGallery: () => void;
  onSelectCamera: () => void;
}

export const ProfileImageModal: React.FC<ProfileImageModalProps> = ({
  visible,
  onClose,
  onSelectGallery,
  onSelectCamera,
}) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* ✅ Pressable로 변경하고, 모달 내부 클릭 시 닫히지 않도록 */}
      <Pressable 
        style={styles.overlay} 
        onPress={onClose}
      >
        {/* ✅ onStartShouldSetResponder로 이벤트 전파 막기 */}
        <View 
          style={styles.modal}
          onStartShouldSetResponder={() => true}
          onTouchEnd={(e) => e.stopPropagation()}
        >
          <Text style={styles.title}>프로필 사진 변경</Text>
          
          <TouchableOpacity 
            style={styles.option} 
            onPress={onSelectGallery}
            activeOpacity={0.7}
          >
            <Ionicons name="images-outline" size={24} color="#4ECDC4" />
            <Text style={styles.optionText}>갤러리에서 선택</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.option} 
            onPress={onSelectCamera}
            activeOpacity={0.7}
          >
            <Ionicons name="camera-outline" size={24} color="#4ECDC4" />
            <Text style={styles.optionText}>사진 촬영</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.cancelButton} 
            onPress={onClose}
            activeOpacity={0.7}
          >
            <Text style={styles.cancelText}>취소</Text>
          </TouchableOpacity>
        </View>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 24,
    width: '100%',
    maxWidth: 320,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    marginBottom: 20,
    textAlign: 'center',
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
    gap: 12,
  },
  optionText: {
    fontSize: 16,
    color: '#333',
    fontWeight: '500',
  },
  cancelButton: {
    marginTop: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  cancelText: {
    fontSize: 16,
    color: '#999',
    fontWeight: '600',
  },
});