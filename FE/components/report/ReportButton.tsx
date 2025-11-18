import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ReportButtonProps {
  onPress: () => void;
  style?: ViewStyle;
}

export const ReportButton: React.FC<ReportButtonProps> = ({ onPress, style }) => {
  return (
    <TouchableOpacity 
      style={[styles.reportButton, style]} 
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name="megaphone-outline" size={20} color="#FFF" />
      <Text style={styles.reportButtonText}>신고하기</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  reportButton: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    backgroundColor: '#FF4757',
    borderRadius: 12,
    marginBottom: 12,
    gap: 8,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFF',
  },
});