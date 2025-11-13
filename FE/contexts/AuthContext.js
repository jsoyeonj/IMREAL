// FE/contexts/AuthContext.js
// 인증 상태를 전역으로 관리

import React, { createContext, useState, useContext, useEffect } from 'react';
import { getToken, saveToken, getUser, saveUser, clearAll } from '../utils/storage';
import { login as loginApi, register as registerApi, getProfile } from '../services/authApi';

// Context 생성
const AuthContext = createContext(null);

// Provider 컴포넌트
export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // 앱 시작 시 저장된 토큰 확인
  useEffect(() => {
    checkAuth();
  }, []);

  /**
   * 저장된 인증 정보 확인
   */
  const checkAuth = async () => {
    try {
      const savedToken = await getToken();
      const savedUser = await getUser();

      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(savedUser);
        console.log('✅ 저장된 인증 정보 로드');
      }
    } catch (error) {
      console.error('❌ 인증 확인 오류:', error);
    } finally {
      setLoading(false);
    }
  };

  /**
   * 로그인
   */
  const login = async (email, password) => {
    try {
      const result = await loginApi(email, password);

      if (result.success) {
        // 토큰과 사용자 정보 저장
        await saveToken(result.token);
        await saveUser(result.user);

        // 상태 업데이트
        setToken(result.token);
        setUser(result.user);

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: '로그인 중 오류가 발생했습니다' };
    }
  };

  /**
   * 회원가입
   */
  const register = async (email, nickname, password, passwordConfirm) => {
    try {
      const result = await registerApi(email, nickname, password, passwordConfirm);

      if (result.success) {
        // 토큰과 사용자 정보 저장
        await saveToken(result.token);
        await saveUser(result.user);

        // 상태 업데이트
        setToken(result.token);
        setUser(result.user);

        return { success: true };
      } else {
        return { success: false, error: result.error };
      }
    } catch (error) {
      return { success: false, error: '회원가입 중 오류가 발생했습니다' };
    }
  };

  /**
   * 로그아웃
   */
  const logout = async () => {
    try {
      // 저장된 데이터 삭제
      await clearAll();

      // 상태 초기화
      setToken(null);
      setUser(null);

      console.log('👋 로그아웃 완료');
      return { success: true };
    } catch (error) {
      console.error('❌ 로그아웃 오류:', error);
      return { success: false };
    }
  };

  /**
   * 프로필 새로고침
   */
  const refreshProfile = async () => {
    if (!token) return;

    try {
      const result = await getProfile(token);

      if (result.success) {
        await saveUser(result.user);
        setUser(result.user);
      }
    } catch (error) {
      console.error('❌ 프로필 새로고침 오류:', error);
    }
  };

  // Context에 제공할 값
  const value = {
    token,
    user,
    loading,
    isAuthenticated: !!token,  // 로그인 여부
    login,
    register,
    logout,
    refreshProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

// Hook으로 Context 사용
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  
  return context;
};