// FE/services/deepfakeApi.js
// 백엔드 API 호출 함수들

import { API_ENDPOINTS } from '../config/api';

/**
 * 이미지 딥페이크 분석
 * @param {string} imageUri - 이미지 파일 URI
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 분석 결과
 */
export const analyzeImage = async (imageUri, token) => {
  try {
    const formData = new FormData();
    
    // 파일 확장자에서 타입 추출
    const uriParts = imageUri.split('.');
    const fileType = uriParts[uriParts.length - 1].toLowerCase();
    
    // MIME 타입 결정
    let mimeType = 'image/jpeg';  // 기본값
    if (fileType === 'png') {
      mimeType = 'image/png';
    } else if (fileType === 'heic' || fileType === 'heif') {
      mimeType = 'image/heic';
    }
    
    console.log('📷 파일 타입:', fileType, '→', mimeType);
    
    // 이미지 파일 추가
    formData.append('image', {
      uri: imageUri,
      type: mimeType,
      name: `photo.${fileType === 'heic' || fileType === 'heif' ? 'jpg' : fileType}`,
    });

    console.log('🔍 이미지 분석 요청:', imageUri);

    // API 호출
    const response = await fetch(API_ENDPOINTS.DETECT_IMAGE, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '분석 중 오류가 발생했습니다');
    }

    console.log('✅ 이미지 분석 완료:', data);

    // ✅ 새로운 응답 구조에 맞춰 처리
    return {
      success: true,
      recordId: data.record_id,
      faceCount: data.face_count,
      faceResults: data.face_quality_scores, // ✅ ResultUrl 포함된 배열
      processingTime: data.processing_time,
    };

  } catch (error) {
    console.error('❌ 이미지 분석 오류:', error);
    return {
      success: false,
      error: error.message || '분석 중 문제가 발생했습니다',
    };
  }
};

/**
 * 영상 딥페이크 분석 (다중 사람)
 * @param {string} videoUri - 영상 파일 URI
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 분석 결과
 */
export const analyzeVideo = async (videoUri, token) => {
  try {
    const formData = new FormData();
    
    formData.append('video', {
      uri: videoUri,
      type: 'video/mp4',
      name: 'video.mp4',
    });

    console.log('🎥 영상 분석 요청:', videoUri);

    const response = await fetch(API_ENDPOINTS.DETECT_VIDEO, {
      method: 'POST',
      headers: {
        'Authorization': `Token ${token}`,
      },
      body: formData,
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || '분석 중 오류가 발생했습니다');
    }

    console.log('✅ 영상 분석 완료:', data);

    // ✅ 새로운 응답 구조에 맞춰 처리
    return {
      success: true,
      recordId: data.record_id,
      faceCount: data.face_count,
      faceResults: data.face_quality_scores, // ✅ ResultUrl 포함된 배열
      processingTime: data.processing_time,
    };

  } catch (error) {
    console.error('❌ 영상 분석 오류:', error);
    return {
      success: false,
      error: error.message || '분석 중 문제가 발생했습니다',
    };
  }
};

/**
 * 분석 기록 조회
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 분석 기록 목록
 */
export const getAnalysisRecords = async (token) => {
  try {
    const response = await fetch(API_ENDPOINTS.DETECTION_RECORDS, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('기록을 불러오는데 실패했습니다');
    }

    return {
      success: true,
      records: data.results || data,
    };

  } catch (error) {
    console.error('❌ 기록 조회 오류:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * 분석 통계 조회
 * @param {string} token - 인증 토큰
 * @returns {Promise<Object>} 통계 데이터
 */
export const getAnalysisStatistics = async (token) => {
  try {
    const response = await fetch(API_ENDPOINTS.DETECTION_STATISTICS, {
      method: 'GET',
      headers: {
        'Authorization': `Token ${token}`,
        'Content-Type': 'application/json',
      },
    });

    const data = await response.json();
    
    if (!response.ok) {
      throw new Error('통계를 불러오는데 실패했습니다');
    }

    return {
      success: true,
      statistics: data,
    };

  } catch (error) {
    console.error('❌ 통계 조회 오류:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};