// FE/services/watermarkApi.js
// 워터마크 API 호출 함수

import { API_ENDPOINTS } from '../config/api';

/**
 * 이미지에 워터마크 추가
 * @param {string} imageUri - 이미지 파일 URI
 * @param {string} token - 인증 토큰
 * @param {string} jobType - 작업 유형 ('watermark', 'adversarial_noise', 'both')
 * @param {string} watermarkText - 워터마크로 사용할 텍스트
 * @returns {Promise<Object>} 워터마크 추가 결과
 */
export const addWatermark = async (
  imageUri, 
  token, 
  jobType = 'watermark',
  watermarkText = 'IMREAL'
) => {
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
    
    console.log('🖼️ 워터마크 파일 타입:', fileType, '→', mimeType);
    
    // ✅ 이미지 파일 추가 (백엔드가 'files' 필드로 받음)
    formData.append('files', {
      uri: imageUri,
      type: mimeType,
      name: `image.${fileType === 'heic' || fileType === 'heif' ? 'jpg' : fileType}`,
    });
    
    // ✅ job_type 추가
    formData.append('job_type', jobType);

    // ✅ watermark_text 추가
    formData.append('watermark_text', watermarkText);

    console.log('🔒 워터마크 추가 요청:', {
      uri: imageUri,
      jobType,
      watermarkText,
      endpoint: API_ENDPOINTS.PROTECT_IMAGE
    });

    // ✅ 타임아웃 설정 (60초)
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 60000);

    try {
      // ✅ API 호출
      const response = await fetch(API_ENDPOINTS.PROTECT_IMAGE, {
        method: 'POST',
        headers: {
          'Authorization': `Token ${token}`,
          'Content-Type': 'multipart/form-data',
        },
        body: formData,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || '워터마크 추가 중 오류가 발생했습니다');
      }

      console.log('✅ 워터마크 추가 완료:', data);

      // ✅ 백엔드 응답 구조에 맞춰 처리
      // 응답 예시: { job_id, status, protected_files: [{ request_version, ResultUrl, file_name }] }
      return {
        success: true,
        jobId: data.job_id,
        status: data.status,
        protectedFiles: data.protected_files, // [{ request_version, ResultUrl, file_name }]
      };

    } catch (fetchError) {
      clearTimeout(timeoutId);
      
      if (fetchError.name === 'AbortError') {
        throw new Error('요청 시간이 초과되었습니다. 다시 시도해주세요.');
      }
      throw fetchError;
    }

  } catch (error) {
    console.error('❌ 워터마크 추가 오류:', error);
    return {
      success: false,
      error: error.message || '워터마크 추가 중 문제가 발생했습니다',
    };
  }
};