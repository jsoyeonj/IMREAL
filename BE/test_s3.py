import boto3
import os
from dotenv import load_dotenv

load_dotenv()

# S3 클라이언트 생성
s3_client = boto3.client(
    's3',
    aws_access_key_id=os.getenv('AWS_ACCESS_KEY_ID'),
    aws_secret_access_key=os.getenv('AWS_SECRET_ACCESS_KEY'),
    region_name=os.getenv('AWS_REGION')
)

bucket_name = os.getenv('AWS_STORAGE_BUCKET_NAME')

try:
    # 버킷 존재 확인
    response = s3_client.list_objects_v2(Bucket=bucket_name, MaxKeys=1)
    print(f"✅ S3 연결 성공! 버킷: {bucket_name}")
except Exception as e:
    print(f"❌ S3 연결 실패: {str(e)}")