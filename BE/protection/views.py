from rest_framework import status, generics
from rest_framework.response import Response
from rest_framework.views import APIView
from django.conf import settings
import os

from .models import ProtectionJob
from .serializers import (
    ProtectionJobSerializer,
    ProtectionJobListSerializer,
    ImageProtectionRequestSerializer,
    VideoProtectionRequestSerializer
)
from .services import ProtectionService
from media_files.services import FileService


class ImageProtectionView(APIView):
    """이미지 보호 API - S3 URL만 반환"""
    
    def post(self, request):
        serializer = ImageProtectionRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        uploaded_files = serializer.validated_data['files']
        job_type = serializer.validated_data['job_type']
        # ✅ 워터마크 텍스트 받기
        watermark_text = serializer.validated_data.get('watermark_text', 'IMREAL')
        
        file_service = FileService(request.user)
        media_files = []
        
        try:
            for file in uploaded_files:
                media_file = file_service.upload_file(
                    uploaded_file=file,
                    file_type='image',
                    purpose='protection',
                    is_temporary=False,
                    use_s3=settings.USE_S3_FOR_PROTECTION
                )
                media_files.append(media_file)
            
            original_files_data = [
                {
                    'file_id': mf.file_id,
                    'file_name': mf.original_name,
                    'file_size': mf.file_size,
                    'file_path': mf.file_path,
                    'mime_type': mf.mime_type,
                    'storage_type': mf.storage_type
                }
                for mf in media_files
            ]
            
            job = ProtectionJob.objects.create(
                user=request.user,
                job_type=job_type,
                original_files=original_files_data,
                job_status='pending',
                progress_percentage=0.0
            )
            
            # S3 URL 생성
            from media_files.storage import S3Storage
            
            if media_files[0].storage_type == 's3':
                s3_storage = S3Storage()
                s3_url = s3_storage.get_presigned_url(media_files[0].s3_key)
            else:
                s3_url = request.build_absolute_uri(f'/media/{media_files[0].file_path}')
            
            # ✅ AI 서버 호출 (watermark_text 전달)
            protection_service = ProtectionService()
            result = protection_service.protect_image(s3_url, job_type, watermark_text)
            
            if not result['success']:
                job.job_status = 'failed'
                job.error_message = result.get('error', '알 수 없는 오류')
                job.save()
                return Response({'error': result['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # ResultUrl을 Presigned URL로 변환
            from media_files.storage import S3Storage
            import re
            
            if 'results' in result:
                for protected_info in result['results']:
                    if 'ResultUrl' in protected_info and protected_info['ResultUrl']:
                        original_url = protected_info['ResultUrl']
                        match = re.search(r'amazonaws\.com/(.+?)$', original_url)
                        if match:
                            s3_key = match.group(1)
                            s3_storage = S3Storage()
                            protected_info['ResultUrl'] = s3_storage.get_presigned_url(s3_key)
            
            # 결과 처리
            if 'results' in result:
                protected_files_data = []
                for idx, protected_info in enumerate(result['results']):
                    protected_files_data.append({
                        'request_version': protected_info.get('request_version'),
                        'ResultUrl': protected_info.get('ResultUrl'),
                        'file_name': media_files[idx].original_name if idx < len(media_files) else 'unknown'
                    })
            else:
                protected_files_data = []
            
            job.protected_files = protected_files_data
            job.job_status = 'completed'
            job.progress_percentage = 100.0
            job.save()
            
            return Response({
                'job_id': job.job_id,
                'status': 'completed',
                'protected_files': protected_files_data
            }, status=status.HTTP_201_CREATED)
        
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)



class VideoProtectionView(APIView):
    """영상 보호 API - S3 URL만 반환"""
    
    def post(self, request):
        serializer = VideoProtectionRequestSerializer(data=request.data)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        
        video = serializer.validated_data['file']
        job_type = serializer.validated_data['job_type']
        # ✅ 워터마크 텍스트 받기
        watermark_text = serializer.validated_data.get('watermark_text', 'IMREAL')
        
        file_service = FileService(request.user)
        
        try:
            media_file = file_service.upload_file(
                uploaded_file=video,
                file_type='video',
                purpose='protection',
                is_temporary=False,
                use_s3=settings.USE_S3_FOR_PROTECTION
            )
            
            original_files_data = [{
                'file_id': media_file.file_id,
                'file_name': media_file.original_name,
                'file_size': media_file.file_size,
                'file_path': media_file.file_path,
                'mime_type': media_file.mime_type,
                'storage_type': media_file.storage_type
            }]
            
            job = ProtectionJob.objects.create(
                user=request.user,
                job_type=job_type,
                original_files=original_files_data,
                job_status='pending',
                progress_percentage=0.0
            )
            
            # S3 URL 생성
            from media_files.storage import S3Storage
            
            if media_file.storage_type == 's3':
                s3_storage = S3Storage()
                s3_url = s3_storage.get_presigned_url(media_file.s3_key)
            else:
                s3_url = request.build_absolute_uri(f'/media/{media_file.file_path}')
            
            # ✅ AI 서버 호출 (watermark_text 전달)
            protection_service = ProtectionService()
            result = protection_service.protect_video(s3_url, job_type, watermark_text)
            
            if not result['success']:
                job.job_status = 'failed'
                job.error_message = result.get('error', '알 수 없는 오류')
                job.save()
                return Response({'error': result['error']}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
            
            # ResultUrl을 Presigned URL로 변환
            from media_files.storage import S3Storage
            import re
            
            if 'results' in result:
                for protected_info in result['results']:
                    if 'ResultUrl' in protected_info and protected_info['ResultUrl']:
                        original_url = protected_info['ResultUrl']
                        match = re.search(r'amazonaws\.com/(.+?)$', original_url)
                        if match:
                            s3_key = match.group(1)
                            s3_storage = S3Storage()
                            protected_info['ResultUrl'] = s3_storage.get_presigned_url(s3_key)
            
            # 결과 처리
            if 'results' in result:
                job.protected_files = result['results']
                protected_url = result['results'][0].get('ResultUrl') if result['results'] else None
                protected_filename = media_file.original_name
            else:
                protected_url = None
                protected_filename = media_file.original_name
                job.protected_files = []

            job.job_status = 'completed'
            job.progress_percentage = 100.0
            job.save()
            
            return Response({
                'job_id': job.job_id,
                'status': 'completed',
                'protected_url': protected_url,
                'file_name': protected_filename
            }, status=status.HTTP_201_CREATED)
        
        except ValueError as e:
            return Response({'error': str(e)}, status=status.HTTP_400_BAD_REQUEST)


class ProtectionJobListView(generics.ListAPIView):
    """보호 작업 목록 조회 API"""
    
    serializer_class = ProtectionJobListSerializer
    
    def get_queryset(self):
        return ProtectionJob.objects.filter(user=self.request.user)


class ProtectionJobDetailView(generics.RetrieveAPIView):
    """보호 작업 상세 조회 API"""
    
    serializer_class = ProtectionJobSerializer
    
    def get_queryset(self):
        return ProtectionJob.objects.filter(user=self.request.user)