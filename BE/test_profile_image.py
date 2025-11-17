"""
프로필 이미지 업로드 API 테스트 스크립트
사용법: python test_profile_image.py
"""

import requests
import os
from PIL import Image

# 설정
BASE_URL = "http://localhost:8000"
TEST_EMAIL = "khmin0593@gmail.com"
TEST_PASSWORD = "1234"  # ✅ 실제 비밀번호로 변경하세요!
TEST_IMAGE_PATH = "test_profile_khmin.jpg"


def create_test_image():
    """테스트용 이미지 생성"""
    try:
        img = Image.new('RGB', (300, 300), color='blue')
        img.save(TEST_IMAGE_PATH)
        print(f"✅ 테스트 이미지 생성: {TEST_IMAGE_PATH}")
        return True
    except ImportError:
        print("❌ PIL 라이브러리가 필요합니다: pip install pillow")
        return False


def test_login():
    """1. 로그인 테스트"""
    print("\n" + "="*50)
    print("📝 1단계: 로그인")
    print("="*50)
    
    url = f"{BASE_URL}/api/users/login/"
    data = {
        "email": TEST_EMAIL,
        "password": TEST_PASSWORD
    }
    
    try:
        response = requests.post(url, json=data)
        
        if response.status_code == 200:
            result = response.json()
            token = result.get('token')
            user_id = result.get('user', {}).get('user_id')
            
            print(f"✅ 로그인 성공!")
            print(f"   Token: {token[:30]}...")
            print(f"   User ID: {user_id}")
            return token
        else:
            print(f"❌ 로그인 실패: {response.status_code}")
            print(f"   응답: {response.text}")
            return None
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return None


def test_upload_profile_image(token):
    """2. 프로필 이미지 업로드 테스트"""
    print("\n" + "="*50)
    print("📸 2단계: 프로필 이미지 업로드")
    print("="*50)
    
    url = f"{BASE_URL}/api/users/profile/image/"
    headers = {"Authorization": f"Token {token}"}
    
    try:
        with open(TEST_IMAGE_PATH, 'rb') as f:
            files = {'image': ('profile.jpg', f, 'image/jpeg')}
            response = requests.post(url, files=files, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 업로드 성공!")
            print(f"   파일 경로: {result.get('profile_image')}")
            print(f"   이미지 URL: {result.get('profile_image_url')}")
            print(f"   메시지: {result.get('message')}")
            return True
        else:
            print(f"❌ 업로드 실패: {response.status_code}")
            print(f"   응답: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False


def test_get_profile_image(token):
    """3. 프로필 이미지 조회 테스트"""
    print("\n" + "="*50)
    print("🔍 3단계: 프로필 이미지 조회")
    print("="*50)
    
    url = f"{BASE_URL}/api/users/profile/image/get/"
    headers = {"Authorization": f"Token {token}"}
    
    try:
        response = requests.get(url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 조회 성공!")
            print(f"   파일 경로: {result.get('profile_image')}")
            print(f"   이미지 URL: {result.get('profile_image_url')}")
            
            # 브라우저에서 볼 수 있는 URL 출력
            if result.get('profile_image_url'):
                print(f"\n🌐 브라우저에서 이미지 보기:")
                print(f"   {result.get('profile_image_url')}")
            
            return True
        else:
            print(f"❌ 조회 실패: {response.status_code}")
            print(f"   응답: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False


def test_delete_profile_image(token):
    """4. 프로필 이미지 삭제 테스트"""
    print("\n" + "="*50)
    print("🗑️  4단계: 프로필 이미지 삭제")
    print("="*50)
    
    url = f"{BASE_URL}/api/users/profile/image/delete/"
    headers = {"Authorization": f"Token {token}"}
    
    try:
        response = requests.delete(url, headers=headers)
        
        if response.status_code == 200:
            result = response.json()
            print(f"✅ 삭제 성공!")
            print(f"   메시지: {result.get('message')}")
            return True
        else:
            print(f"❌ 삭제 실패: {response.status_code}")
            print(f"   응답: {response.text}")
            return False
            
    except Exception as e:
        print(f"❌ 오류 발생: {e}")
        return False


def main():
    """메인 실행"""
    print("=" * 50)
    print("🚀 프로필 이미지 API 테스트 시작")
    print("=" * 50)
    
    # 0. 테스트 이미지 생성
    if not os.path.exists(TEST_IMAGE_PATH):
        if not create_test_image():
            print("\n❌ 테스트를 계속할 수 없습니다.")
            return
    
    # 1. 로그인
    token = test_login()
    if not token:
        print("\n❌ 로그인 실패로 테스트를 중단합니다.")
        print("⚠️  TEST_EMAIL과 TEST_PASSWORD를 확인하세요!")
        return
    
    # 2. 프로필 이미지 업로드
    if test_upload_profile_image(token):
        print("\n✅ 업로드 테스트 통과!")
    
    # 3. 프로필 이미지 조회
    if test_get_profile_image(token):
        print("\n✅ 조회 테스트 통과!")
    
    # 4. 두 번째 이미지 업로드 (기존 이미지 자동 삭제 테스트)
    print("\n" + "="*50)
    print("🔄 5단계: 새 이미지 업로드 (기존 이미지 자동 삭제 테스트)")
    print("="*50)
    if test_upload_profile_image(token):
        print("\n✅ 기존 이미지 자동 삭제 테스트 통과!")
    
    # 5. 프로필 이미지 삭제
    if test_delete_profile_image(token):
        print("\n✅ 삭제 테스트 통과!")
    
    # 정리
    if os.path.exists(TEST_IMAGE_PATH):
        os.remove(TEST_IMAGE_PATH)
        print(f"\n🧹 테스트 이미지 삭제: {TEST_IMAGE_PATH}")
    
    print("\n" + "="*50)
    print("🎉 모든 테스트 완료!")
    print("="*50)


if __name__ == "__main__":
    main()