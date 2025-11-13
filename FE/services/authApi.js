// FE/services/authApi.js
// 사용자 인증 관련 API

import { API_ENDPOINTS } from '../config/api';

/**
 * 로그인
 * @param {string} email - 이메일
 * @param {string} password - 비밀번호
 * @returns {Promise<Object>} 로그인 결과
 */
export const login = async (email, password) => {
  try {
    console.log('🔐 로그인 시도:', email);

    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '로그인에 실패했습니다');
    }

    console.log('✅ 로그인 성공');

    return {
      success: true,
      token: data.token,
      user: {
        userId: data.user.user_id,
        email: data.user.email,
        nickname: data.user.nickname,
      },
    };

  } catch (error) {
    console.error('❌ 로그인 오류:', error);
    return {
      success: false,
      error: error.message || '로그인 중 문제가 발생했습니다',
    };
  }
};

/**
 * 회원가입
 * @param {string} email - 이메일
 * @param {string} nickname - 닉네임
 * @param {string} password - 비밀번호
 * @param {string} passwordConfirm - 비밀번호 확인
 * @returns {Promise<Object>} 회원가입 결과
 */
export const register = async (email, nickname, password, passwordConfirm) => {
  try {
    console.log('📝 회원가입 시도:', email);

    const response = await fetch(API_ENDPOINTS.REGISTER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        nickname,
        password,
        password_confirm: passwordConfirm,
      }),
    });

    const data = await response.json();
    
    if (!response.ok) {
      // 백엔드 에러 메시지 처리
      const errorMessage = data.email?.[0] || data.nickname?.[0] || data.password?.[0] || data.error || '회원가입에 실패했습니다';
      throw new Error(errorMessage);
    }

    console.log('✅ 회원가입 성공');

    return {
      success: true,
      token: data.token,
      user: {
        userId: data.user.user_id,
        email: data.user.email,
        nickname: data.user.nickname,
      },
    };

  } catch (error) {
    console.error('❌ 회원가입 오류:', error);
    return {
      success: false,
      error: error.message || '회원가입 중 문제가 발생했습니다',
    };
  }
};

/**
 * 프로필 조회
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 프로필 정보
 */
export const getProfile = async (token) => {
  try {
    const response = await fetch(API_ENDPOINTS.PROFILE, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('프로필을 불러오는데 실패했습니다');
    }

    return {
      success: true,
      user: {
        userId: data.user_id,
        email: data.email,
        nickname: data.nickname,
        createdAt: data.created_at,
      },
    };

  } catch (error) {
    console.error('❌ 프로필 조회 오류:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};