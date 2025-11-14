// FE/config/api.js
// 백엔드 서버 주소 설정

const API_BASE_URL = 'http://192.168.35.253:8000';  // ✅ Wi-Fi IP 주소로 변경

export const API_ENDPOINTS = {
  // 인증
  LOGIN: `${API_BASE_URL}/api/users/login/`,
  REGISTER: `${API_BASE_URL}/api/users/register/`,
  PROFILE: `${API_BASE_URL}/api/users/profile/`,
  
  // 딥페이크 탐지
  DETECT_IMAGE: `${API_BASE_URL}/api/detection/image/`,
  DETECT_VIDEO: `${API_BASE_URL}/api/detection/video/`,
  DETECTION_RECORDS: `${API_BASE_URL}/api/detection/records/`,
  DETECTION_STATISTICS: `${API_BASE_URL}/api/detection/statistics/`,
  
  // 이미지/영상 보호
  PROTECT_IMAGE: `${API_BASE_URL}/api/protection/images/`,
  PROTECT_VIDEO: `${API_BASE_URL}/api/protection/videos/`,
  
  // 신고
  SUBMIT_REPORT: `${API_BASE_URL}/api/reports/submit/`,
};

export default API_BASE_URL;