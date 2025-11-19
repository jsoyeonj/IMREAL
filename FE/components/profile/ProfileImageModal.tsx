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
      <Pressable style={styles.overlay} onPress={onClose}>
        <Pressable style={styles.modal} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.title}>프로필 사진 변경</Text>
          
          <Pressable 
            style={styles.option} 
            onPress={(e) => {
              e.stopPropagation();
              onSelectGallery();
            }}
          >
            <Ionicons name="images-outline" size={24} color="#4ECDC4" />
            <Text style={styles.optionText}>갤러리에서 선택</Text>
          </Pressable>

          <Pressable 
            style={styles.option} 
            onPress={(e) => {
              e.stopPropagation();
              onSelectCamera();
            }}
          >
            <Ionicons name="camera-outline" size={24} color="#4ECDC4" />
            <Text style={styles.optionText}>사진 촬영</Text>
          </Pressable>

          <Pressable 
            style={styles.cancelButton} 
            onPress={(e) => {
              e.stopPropagation();
              onClose();
            }}
          >
            <Text style={styles.cancelText}>취소</Text>
          </Pressable>
        </Pressable>
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