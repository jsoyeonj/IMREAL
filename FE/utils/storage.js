// FE/utils/storage.js
// AsyncStorage를 사용한 데이터 저장/불러오기

import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEYS = {
  TOKEN: '@auth_token',
  USER: '@user_data',
};

/**
 * 토큰 저장
 */
export const saveToken = async (token) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, token);
    console.log('💾 토큰 저장 완료');
    return true;
  } catch (error) {
    console.error('❌ 토큰 저장 실패:', error);
    return false;
  }
};

/**
 * 토큰 불러오기
 */
export const getToken = async () => {
  try {
    const token = await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
    return token;
  } catch (error) {
    console.error('❌ 토큰 불러오기 실패:', error);
    return null;
  }
};

/**
 * 토큰 삭제
 */
export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    console.log('🗑️ 토큰 삭제 완료');
    return true;
  } catch (error) {
    console.error('❌ 토큰 삭제 실패:', error);
    return false;
  }
};

/**
 * 사용자 정보 저장
 */
export const saveUser = async (user) => {
  try {
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(user));
    console.log('💾 사용자 정보 저장 완료');
    return true;
  } catch (error) {
    console.error('❌ 사용자 정보 저장 실패:', error);
    return false;
  }
};

/**
 * 사용자 정보 불러오기
 */
export const getUser = async () => {
  try {
    const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    return userData ? JSON.parse(userData) : null;
  } catch (error) {
    console.error('❌ 사용자 정보 불러오기 실패:', error);
    return null;
  }
};

/**
 * 사용자 정보 삭제
 */
export const removeUser = async () => {
  try {
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
    console.log('🗑️ 사용자 정보 삭제 완료');
    return true;
  } catch (error) {
    console.error('❌ 사용자 정보 삭제 실패:', error);
    return false;
  }
};

/**
 * 모든 데이터 삭제 (로그아웃)
 */
export const clearAll = async () => {
  try {
    await AsyncStorage.multiRemove([STORAGE_KEYS.TOKEN, STORAGE_KEYS.USER]);
    console.log('🗑️ 모든 데이터 삭제 완료');
    return true;
  } catch (error) {
    console.error('❌ 데이터 삭제 실패:', error);
    return false;
  }
};