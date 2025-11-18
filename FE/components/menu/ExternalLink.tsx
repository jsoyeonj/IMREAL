// components/menu/ExternalLink.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

interface ExternalLinkProps {
  title: string;
  url: string;
  description: string;
}

export const ExternalLink: React.FC<ExternalLinkProps> = ({
  title,
  url,
  description,
}) => {
  const handlePress = async () => {
    if (!url || url.trim() === '') {
      Alert.alert('알림', '준비 중인 링크입니다.');
      return;
    }

    try {
      await WebBrowser.openBrowserAsync(url);
    } catch (error) {
      console.error('링크 열기 실패:', error);
      Alert.alert('오류', '링크를 열 수 없습니다.');
    }
  };

  return (
    <TouchableOpacity
      style={styles.container}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Ionicons name="globe-outline" size={20} color="#4ECDC4" />
        </View>
        <View style={styles.textContainer}>
          <Text style={styles.title}>{title}</Text>
          {description && (
            <Text style={styles.description}>{description}</Text>
          )}
          {url && (
            <Text style={styles.url} numberOfLines={1}>
              {url}
            </Text>
          )}
        </View>
        <Ionicons name="open-outline" size={18} color="#999" />
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFF',
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: '#E8E8E8',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 14,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#E6F6F4',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111',
    marginBottom: 2,
  },
  description: {
    fontSize: 12,
    color: '#666',
    marginBottom: 2,
  },
  url: {
    fontSize: 11,
    color: '#999',
  },
});