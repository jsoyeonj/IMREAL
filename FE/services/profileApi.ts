// FE/services/profileApi.ts
import AsyncStorage from '@react-native-async-storage/async-storage';
import API_BASE_URL from '../config/api';  // ✅ 이렇게 변경!

/**
 * 프로필 이미지 업로드
 */
export const uploadProfileImage = async (imageUri: string) => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    if (!token) throw new Error('로그인이 필요합니다');

    const formData = new FormData();
    
    // 이미지 파일 추가
    const filename = imageUri.split('/').pop() || 'profile.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type: type,
    } as any);

    const response = await fetch(`${API_BASE_URL}/api/users/profile/image/`, {  // ✅ 이렇게 변경!
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || '업로드 실패');
    }

    const data = await response.json();
    console.log('✅ 프로필 이미지 업로드 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 프로필 이미지 업로드 실패:', error);
    throw error;
  }
};

/**
 * 프로필 이미지 조회
 */
export const getProfileImage = async () => {
  try {
    const token = await AsyncStorage.getItem('@auth_token');
    if (!token) throw new Error('로그인이 필요합니다');

    const response = await fetch(`${API_BASE_URL}/api/users/profile/image/get/`, {  // ✅ 이렇게 변경!
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('프로필 이미지 조회 실패');
    }

    const data = await response.json();
    console.log('✅ 프로필 이미지 조회 성공:', data);
    return data;
  } catch (error) {
    console.error('❌ 프로필 이미지 조회 실패:', error);
    return { profile_image: null, profile_image_url: null };
  }
};