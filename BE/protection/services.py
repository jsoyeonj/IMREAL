import requests
import time
from django.conf import settings
from media_files.models import SystemLog


class ProtectionService:
    """콘텐츠 보호 서비스 (FastAPI 연동)"""
    
    def __init__(self):
        self.fastapi_url = settings.FASTAPI_WATERMARK_URL
        self.timeout = 600  # 10분
    
# BE/protection/services.py

    def protect_image(self, s3_url, protection_type='both', watermark_text='IMREAL'):
        """이미지 보호 처리"""
        start_time = time.time()
        
        try:
            if not self.check_health():
                print("⚠️ AI 서버 없음 - Mock 데이터 반환")
                return self._get_mock_protection_response(start_time)
            
            # ✅ 워터마크 1번만 호출
            result = self._call_protection_api(s3_url, 'Watermark', watermark_text)
            
            processing_time = int((time.time() - start_time) * 1000)
            
            if result:
                return {
                    'success': True,
                    'results': [result],
                    'processing_time': processing_time
                }
            else:
                return {
                    'success': False,
                    'error': '보호 처리 중 오류가 발생했습니다.',
                    'processing_time': processing_time
                }
        
        except Exception as e:
            print(f"❌ protect_image 에러: {str(e)}")
            import traceback
            traceback.print_exc()
            
            processing_time = int((time.time() - start_time) * 1000)
            return {
                'success': False,
                'error': f'처리 중 오류: {str(e)}',
                'processing_time': processing_time
            }
        
    def protect_video(self, s3_url, protection_type='both', watermark_text='IMREAL'):
        """영상 보호 (이미지와 동일한 로직)"""
        return self.protect_image(s3_url, protection_type, watermark_text)
    
    def _call_protection_api(self, s3_url, request_version, watermark_text='IMREAL'):
        """
        실제 AI 서버 호출
        
        Args:
            s3_url: S3 URL
            request_version: 'Noise' or 'Watermark'
            watermark_text: 워터마크 텍스트
        """
        try:
            # ✅ WaterMark Text 추가
            payload = {
                "request version": request_version,
                "InputUrl": s3_url,
                "WaterMark Text": watermark_text
            }
            
            response = requests.post(
                f"{self.fastapi_url}/add_watermark",
                json=payload,
                timeout=self.timeout
            )
            
            response.raise_for_status()
            result = response.json()
            
            return {
                'request_version': result.get('request_version', request_version),
                'ResultUrl': result.get('ResultUrl')
            }
        
        except requests.exceptions.RequestException as e:
            SystemLog.objects.create(
                log_level='error',
                log_category='protection',
                message=f'{request_version} 보호 실패: {str(e)}',
                error_code='PROTECTION_API_ERROR'
            )
            return None
    
    def _get_mock_protection_response(self, start_time):
        """Mock 응답"""
        processing_time = int((time.time() - start_time) * 1000)
        
        return {
            'success': True,
            'results': [
                {'request_version': 'Noise', 'ResultUrl': None},
                {'request_version': 'Watermark', 'ResultUrl': None}
            ],
            'processing_time': processing_time
        }
    
    def check_health(self):
        """FastAPI 서버 상태 확인"""
        try:
            response = requests.get(
                f"{self.fastapi_url}/health",
                timeout=2
            )
            return response.status_code == 200
        except:
            return False