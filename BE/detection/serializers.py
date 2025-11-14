from rest_framework import serializers
from .models import AnalysisRecord


class AnalysisRecordSerializer(serializers.ModelSerializer):
    """분석 기록 Serializer"""
    
    analysis_type_display = serializers.CharField(
        source='get_analysis_type_display',
        read_only=True
    )
    analysis_result_display = serializers.CharField(
        source='get_analysis_result_display',
        read_only=True
    )
    # ✅ is_deepfake 필드 추가
    is_deepfake = serializers.SerializerMethodField()
    
    class Meta:
        model = AnalysisRecord
        fields = [
            'record_id',
            'user',
            'analysis_type',
            'analysis_type_display',
            'file_name',
            'file_size',
            'file_format',
            'original_path',
            'processed_path',
            'heatmap_path',  # ✅ 히트맵 경로
            'analysis_result',
            'analysis_result_display',
            'is_deepfake',  # ✅ 추가
            'confidence_score',
            'detection_details',  # ✅ 다중 사람 분석 결과
            'processing_time',
            'ai_model_version',
            'created_at',
            'updated_at'
        ]
        read_only_fields = [
            'record_id',
            'user',
            'created_at',
            'updated_at'
        ]
    
    # ✅ 메서드 추가
    def get_is_deepfake(self, obj):
        """analysis_result를 기반으로 is_deepfake 계산"""
        return obj.analysis_result in ['suspicious', 'deepfake']


class ImageAnalysisRequestSerializer(serializers.Serializer):
    """이미지 분석 요청 Serializer"""
    
    image = serializers.ImageField(required=True)
    analysis_type = serializers.ChoiceField(
        choices=['image', 'screenshot'],
        default='image'
    )


class VideoAnalysisRequestSerializer(serializers.Serializer):
    """영상 분석 요청 Serializer"""
    
    video = serializers.FileField(required=True)
    
    def validate_video(self, value):
        # 파일 확장자 검증
        ext = value.name.split('.')[-1].lower()
        if ext not in ['mp4', 'mov', 'avi']:
            raise serializers.ValidationError(
                "MP4, MOV, AVI 파일만 업로드 가능합니다."
            )
        
        # 파일 크기 검증 (500MB)
        if value.size > 500 * 1024 * 1024:
            raise serializers.ValidationError(
                "파일 크기는 500MB 이하여야 합니다."
            )
        
        return value


class AnalysisRecordListSerializer(serializers.ModelSerializer):
    """분석 기록 목록 Serializer (간단한 정보만)"""
    
    analysis_type_display = serializers.CharField(
        source='get_analysis_type_display',
        read_only=True
    )
    analysis_result_display = serializers.CharField(
        source='get_analysis_result_display',
        read_only=True
    )
    is_deepfake = serializers.SerializerMethodField()
    # ✅ 이미지 URL 추가
    image_url = serializers.SerializerMethodField()
    
    class Meta:
        model = AnalysisRecord
        fields = [
            'record_id',
            'analysis_type',
            'analysis_type_display',
            'file_name',
            'analysis_result',
            'analysis_result_display',
            'is_deepfake',
            'confidence_score',
            'image_url',  # ✅ 추가
            'created_at'
        ]
        read_only_fields = fields
    
    def get_is_deepfake(self, obj):
        """analysis_result를 기반으로 is_deepfake 계산"""
        return obj.analysis_result in ['suspicious', 'deepfake']
    
    # ✅ 이미지 URL 생성
    def get_image_url(self, obj):
        """분석한 이미지의 URL 반환"""
        if obj.original_path:
            # Django의 request 객체에서 base URL 가져오기
            request = self.context.get('request')
            if request:
                return request.build_absolute_uri(f'/media/{obj.original_path}')
        return None
    
class AnalysisStatisticsSerializer(serializers.Serializer):
    """분석 통계 Serializer"""
    
    total_analyses = serializers.IntegerField()
    safe_count = serializers.IntegerField()
    suspicious_count = serializers.IntegerField()
    deepfake_count = serializers.IntegerField()
    recent_analyses = AnalysisRecordListSerializer(many=True)