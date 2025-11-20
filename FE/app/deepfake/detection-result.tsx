// FE/app/deepfake/detection-result.tsx
// 탐지 결과 상세 화면 (탐지 기록에서 특정 기록을 눌렀을 때 표시)

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';
import { getAnalysisRecordDetail } from '../../services/deepfakeApi';

// ✅ 타입 정의
interface DetectionDetail {
  person_id?: number;
  face_id?: number;
  is_deepfake: boolean;
  rate?: number;             // 백엔드에서 사용 (0-1 범위)
  confidence?: number;       // 하위 호환성
  detection_image_url?: string;
  ResultUrl?: string;        // 백엔드에서 사용
}

interface AnalysisRecord {
  record_id: number;
  analysis_result: 'safe' | 'suspicious' | 'deepfake';
  confidence_score: string;
  analysis_type: string;
  file_format: string;
  processing_time: number;
  created_at: string;
  image_url?: string;
  heatmap_url?: string;
  detection_details?: DetectionDetail[];
}

export default function DetectionResultScreen() {
  const router = useRouter();
  const { recordId } = useLocalSearchParams();
  
  const [loading, setLoading] = useState(true);
  const [record, setRecord] = useState<AnalysisRecord | null>(null);

  useEffect(() => {
    loadRecordDetail();
  }, [recordId]);

  const loadRecordDetail = async () => {
    try {
      const token = await AsyncStorage.getItem('@auth_token');
      
      if (!token) {
        Alert.alert('오류', '로그인이 필요합니다');
        router.back();
        return;
      }

      const id = Array.isArray(recordId) ? parseInt(recordId[0]) : parseInt(recordId as string);
      const result = await getAnalysisRecordDetail(token, id) as any;

      if (result.success) {
        setRecord(result.record);
        console.log('✅ 탐지 기록 상세:', result.record);
      } else {
        Alert.alert('오류', '기록을 불러오는데 실패했습니다');
        router.back();
      }
    } catch (error) {
      console.error('❌ 상세 기록 불러오기 오류:', error);
      Alert.alert('오류', '기록을 불러오는데 실패했습니다');
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const getResultStyle = () => {
    if (!record) return {};
    const isSafe = record.analysis_result === 'safe';
    const isSuspicious = record.analysis_result === 'suspicious';
    return {
      backgroundColor: isSafe ? '#E8F5E9' : isSuspicious ? '#FFF3E0' : '#FFEBEE',
      color: isSafe ? '#2E7D32' : isSuspicious ? '#F57C00' : '#C62828',
    };
  };

  const getResultText = () => {
    if (!record) return '';
    switch (record.analysis_result) {
      case 'safe': return '안전한 이미지';
      case 'suspicious': return '의심스러운 이미지';
      case 'deepfake': return '딥페이크 감지';
      default: return '분석 완료';
    }
  };

  const getConfidenceColor = (score: number) => {
    if (score >= 80) return '#2E7D32';
    if (score >= 50) return '#F57C00';
    return '#C62828';
  };

  const handleReport = () => {
    Alert.alert(
      '신고하기',
      '이 콘텐츠를 신고하시겠습니까?',
      [
        { text: '취소', style: 'cancel' },
        { 
          text: '신고', 
          onPress: () => {
            Alert.alert('알림', '신고가 접수되었습니다.');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#4ECDC4" />
          <Text style={styles.loadingText}>불러오는 중...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!record) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>기록을 찾을 수 없습니다</Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.backButton}>돌아가기</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#000" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>탐지 결과</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content}>
        {/* 결과 카드 */}
        <View style={[styles.resultCard, { backgroundColor: getResultStyle().backgroundColor }]}>
          <View style={styles.resultHeader}>
            <Ionicons 
              name={record.analysis_result === 'safe' ? 'checkmark-circle' : 'warning'} 
              size={48} 
              color={getResultStyle().color} 
            />
            <Text style={[styles.resultTitle, { color: getResultStyle().color }]}>
              {getResultText()}
            </Text>
          </View>

          <View style={styles.confidenceContainer}>
            <Text style={styles.confidenceLabel}>신뢰도</Text>
            <Text 
              style={[
                styles.confidenceScore, 
                { color: getConfidenceColor(parseFloat(record.confidence_score)) }
              ]}
            >
              {parseFloat(record.confidence_score).toFixed(1)}%
            </Text>
          </View>

          <View style={styles.progressBarContainer}>
            <View 
              style={{
                height: 8,
                width: `${parseFloat(record.confidence_score)}%`,
                borderRadius: 4,
                backgroundColor: getConfidenceColor(parseFloat(record.confidence_score))
              } as any}
            />
          </View>
        </View>

        {/* 이미지 표시 */}
        {record.image_url && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>분석 이미지</Text>
            <Image 
              source={{ uri: record.image_url }} 
              style={styles.resultImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* 히트맵 표시 */}
        {record.heatmap_url && (
          <View style={styles.imageSection}>
            <Text style={styles.sectionTitle}>히트맵 분석</Text>
            <Image 
              source={{ uri: record.heatmap_url }} 
              style={styles.resultImage}
              resizeMode="contain"
            />
          </View>
        )}

        {/* 상세 정보 */}
        <View style={styles.detailSection}>
          <Text style={styles.sectionTitle}>상세 정보</Text>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>분석 유형</Text>
            <Text style={styles.detailValue}>
              {record.analysis_type === 'image' ? '이미지' : 
               record.analysis_type === 'video' ? '영상' : '기타'}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>파일 형식</Text>
            <Text style={styles.detailValue}>{record.file_format}</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>분석 일시</Text>
            <Text style={styles.detailValue}>
              {new Date(record.created_at).toLocaleString('ko-KR')}
            </Text>
          </View>
        </View>

        {/* 다중 인물 분석 결과 */}
        {record.detection_details && record.detection_details.length > 0 && (
          <View style={styles.detailSection}>
            <Text style={styles.sectionTitle}>인물별 분석 결과</Text>
            {record.detection_details.map((person: DetectionDetail, index: number) => {
              // ✅ rate(0-1) 또는 confidence(0-100) 값 처리
              const confidenceValue = person.rate 
                ? person.rate * 100  // rate를 백분율로 변환
                : person.confidence || 0;  // 하위 호환성
              
              // ✅ 이미지 URL 우선순위
              const imageUrl = person.ResultUrl || person.detection_image_url;
              
              return (
                <View key={index} style={styles.personCard}>
                  <View style={styles.personHeader}>
                    <Text style={styles.personTitle}>
                      인물 {person.person_id || person.face_id || index + 1}
                    </Text>
                    <Text 
                      style={[
                        styles.personStatus,
                        { color: person.is_deepfake ? '#C62828' : '#2E7D32' }
                      ]}
                    >
                      {person.is_deepfake ? '딥페이크 감지' : '안전'}
                    </Text>
                  </View>
                  <Text style={styles.personConfidence}>
                    신뢰도: {confidenceValue.toFixed(1)}%
                  </Text>
                  {imageUrl && (
                    <Image 
                      source={{ uri: imageUrl }}
                      style={styles.personImage}
                      resizeMode="contain"
                    />
                  )}
                </View>
              );
            })}
          </View>
        )}

        {/* 신고하기 버튼 */}
        {record.analysis_result !== 'safe' && (
          <TouchableOpacity 
            style={styles.reportButton}
            onPress={handleReport}
          >
            <Ionicons name="alert-circle-outline" size={20} color="#fff" />
            <Text style={styles.reportButtonText}>신고하기</Text>
          </TouchableOpacity>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#666',
    marginBottom: 20,
  },
  backButton: {
    fontSize: 14,
    color: '#4ECDC4',
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  resultCard: {
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  resultHeader: {
    alignItems: 'center',
    marginBottom: 20,
  },
  resultTitle: {
    fontSize: 24,
    fontWeight: '800',
    marginTop: 12,
  },
  confidenceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  confidenceLabel: {
    fontSize: 14,
    color: '#666',
  },
  confidenceScore: {
    fontSize: 32,
    fontWeight: '800',
  },
  progressBarContainer: {
    height: 8,
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
    overflow: 'hidden',
  },
  imageSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
    marginBottom: 12,
  },
  resultImage: {
    width: '100%',
    height: 300,
    borderRadius: 12,
    backgroundColor: '#f5f5f5',
  },
  detailSection: {
    marginBottom: 20,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    color: '#000',
    fontWeight: '600',
  },
  personCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  personHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  personTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000',
  },
  personStatus: {
    fontSize: 14,
    fontWeight: '600',
  },
  personConfidence: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  personImage: {
    width: '100%',
    height: 200,
    borderRadius: 8,
    backgroundColor: '#fff',
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FF5252',
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 20,
    gap: 8,
  },
  reportButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});