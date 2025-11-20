import requests
import time
from django.conf import settings
from media_files.models import SystemLog


class ProtectionService:
    """콘텐츠 보호 서비스 (FastAPI 연동)"""
    
    def __init__(self):
        self.fastapi_url = settings.FASTAPI_WATERMARK_URL
        self.timeout = 600  # 10분
    
    def protect_image(self, s3_url, protection_type='both', watermark_text='IMREAL'):
        """
        이미지 보호 처리
        
        Args:
            s3_url: S3 URL
            protection_type: 'noise', 'watermark', 'both'
            watermark_text: 워터마크에 삽입할 텍스트
        """
        start_time = time.time()
        
        if not self.check_health():
            print("⚠️ AI 서버 없음 - Mock 데이터 반환")
            return self._get_mock_protection_response(start_time)
        
        results = []
        
        # Noise 처리
        if protection_type in ['noise', 'both']:
            noise_result = self._call_protection_api(s3_url, 'Noise', watermark_text)
            if noise_result:
                results.append(noise_result)
        
        # Watermark 처리
        if protection_type in ['watermark', 'both']:
            watermark_result = self._call_protection_api(s3_url, 'Watermark', watermark_text)
            if watermark_result:
                results.append(watermark_result)
        
        processing_time = int((time.time() - start_time) * 1000)
        
        if results:
            return {
                'success': True,
                'results': results,
                'processing_time': processing_time
            }
        else:
            return {
                'success': False,
                'error': '보호 처리 중 오류가 발생했습니다.',
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