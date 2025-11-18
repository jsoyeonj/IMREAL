import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Linking,
  Alert,
  ScrollView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { REPORT_LINKS, ReportType } from '../../constants/reportLinks';

interface ReportModalProps {
  visible: boolean;
  onClose: () => void;
  onDownloadImage: () => void;
}

export const ReportModal: React.FC<ReportModalProps> = ({
  visible,
  onClose,
  onDownloadImage,
}) => {
  const [activeTab, setActiveTab] = useState<ReportType>('simple');

  const handleOpenLink = async (url: string, title: string) => {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        Alert.alert('오류', `${title} 링크를 열 수 없습니다.`);
      }
    } catch (error) {
      Alert.alert('오류', '링크를 여는 중 문제가 발생했습니다.');
      console.error('Link open error:', error);
    }
  };

  const handleCall = (number: string) => {
    Linking.openURL(`tel:${number}`);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* 헤더 */}
          <View style={styles.header}>
            <Text style={styles.title}>신고하기</Text>
          </View>

          {/* 탭 버튼 */}
          <View style={styles.tabContainer}>
            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'simple' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('simple')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'simple' && styles.activeTabText,
                ]}
              >
                간편 신고
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.tab,
                activeTab === 'ecrm' && styles.activeTab,
              ]}
              onPress={() => setActiveTab('ecrm')}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === 'ecrm' && styles.activeTabText,
                ]}
              >
                ECRM
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={styles.contentScroll}
            showsVerticalScrollIndicator={false}
          >
            {/* 간편 신고 탭 */}
            {activeTab === 'simple' && (
              <View style={styles.content}>
                <Text style={styles.description}>
                  네이버를 통해 간편하게{'\n'}
                  딥페이크 신고 방법을 안내받을 수 있어요!
                </Text>

                {/* 네이버 신고센터 */}
                <View style={styles.linkSection}>
                  <Text style={styles.sectionTitle}>
                    1. 네이버 신고센터
                  </Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() =>
                      handleOpenLink(
                        REPORT_LINKS.NAVER_REPORT.url,
                        REPORT_LINKS.NAVER_REPORT.title
                      )
                    }
                  >
                    <Text style={styles.linkText}>[Link]</Text>
                    <Ionicons name="link" size={20} color="#0071E3" />
                  </TouchableOpacity>
                </View>

                {/* 네이버 권리보호 센터 */}
                <View style={styles.linkSection}>
                  <Text style={styles.sectionTitle}>
                    2. 네이버 권리보호 센터
                  </Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() =>
                      handleOpenLink(
                        REPORT_LINKS.NAVER_RIGHTS.url,
                        REPORT_LINKS.NAVER_RIGHTS.title
                      )
                    }
                  >
                    <Text style={styles.linkText}>[Link]</Text>
                    <Ionicons name="link" size={20} color="#0071E3" />
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {/* ECRM 탭 */}
            {activeTab === 'ecrm' && (
              <View style={styles.content}>
                <Text style={styles.description}>
                  사이버범죄신고시스템(ECRM)을 통해{'\n'}
                  상담 및 신고를 받을 수 있어요!
                </Text>

                {/* ECRM URL */}
                <View style={styles.linkSection}>
                  <Text style={styles.sectionTitle}>
                    1. 사이버범죄 신고시스템 (ECRM)
                  </Text>
                  <TouchableOpacity
                    style={styles.linkButton}
                    onPress={() =>
                      handleOpenLink(
                        REPORT_LINKS.ECRM.url,
                        REPORT_LINKS.ECRM.title
                      )
                    }
                  >
                    <Text style={styles.linkText}>[URL]</Text>
                    <Ionicons name="link" size={20} color="#0071E3" />
                  </TouchableOpacity>
                </View>

                {/* 긴급신고 */}
                <View style={styles.callSection}>
                  <Text style={styles.callTitle}>
                    긴급신고 : 👍
                  </Text>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCall(REPORT_LINKS.ECRM.emergency)}
                  >
                    <Ionicons name="call" size={18} color="#FFF" />
                    <Text style={styles.callButtonText}>
                      {REPORT_LINKS.ECRM.emergency}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.callDescription}>
                    (무료, 상담 가능 시간 : 365일 24시간)
                  </Text>
                </View>

                {/* 민원상담 */}
                <View style={styles.callSection}>
                  <Text style={styles.callTitle}>
                    민원상담 : 👍
                  </Text>
                  <TouchableOpacity
                    style={styles.callButton}
                    onPress={() => handleCall(REPORT_LINKS.ECRM.consultation)}
                  >
                    <Ionicons name="call" size={18} color="#FFF" />
                    <Text style={styles.callButtonText}>
                      {REPORT_LINKS.ECRM.consultation}
                    </Text>
                  </TouchableOpacity>
                  <Text style={styles.callDescription}>
                    (유료, 상담 가능 시간 : 365일 24시간)
                  </Text>
                </View>
              </View>
            )}

            {/* 이미지 다운로드 버튼 */}
            <TouchableOpacity
              style={styles.downloadButton}
              onPress={onDownloadImage}
            >
              <Text style={styles.downloadButtonText}>
                이미지 공유하기
              </Text>
            </TouchableOpacity>
          </ScrollView>

          {/* 닫기 버튼 */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <Ionicons name="arrow-back" size={24} color="#FFF" />
            <Text style={styles.closeButtonText}>홈으로 돌아가기</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
  },
  modalContainer: {
    width: '95%',
    maxWidth: 500,
    height: '80%',
    backgroundColor: '#FFF',
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 8,
  },
  header: {
    paddingVertical: 24,
    paddingHorizontal: 24,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#111',
  },
  tabContainer: {
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingTop: 24,
    paddingBottom: 16,
    gap: 12,
  },
  tab: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#E0E0E0',
    alignItems: 'center',
    backgroundColor: '#FFF',
  },
  activeTab: {
    backgroundColor: '#0071E3',
    borderColor: '#0071E3',
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#666',
  },
  activeTabText: {
    color: '#FFF',
  },
  contentScroll: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 20,
  },
  description: {
    fontSize: 15,
    color: '#666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 32,
  },
  linkSection: {
    marginBottom: 28,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    paddingHorizontal: 24,
    backgroundColor: '#F0F8FF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#0071E3',
    gap: 10,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0071E3',
  },
  callSection: {
    marginBottom: 28,
    alignItems: 'center',
  },
  callTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    marginBottom: 16,
    textAlign: 'center',
  },
  callButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 28,
    backgroundColor: '#0071E3',
    borderRadius: 30,
    gap: 10,
    marginBottom: 10,
  },
  callButtonText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#FFF',
  },
  callDescription: {
    fontSize: 13,
    color: '#999',
    textAlign: 'center',
  },
  downloadButton: {
    marginHorizontal: 24,
    marginTop: 12,
    marginBottom: 24,
    paddingVertical: 18,
    backgroundColor: '#0071E3',
    borderRadius: 12,
    alignItems: 'center',
  },
  downloadButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
  closeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    backgroundColor: '#111',
    gap: 10,
  },
  closeButtonText: {
    fontSize: 17,
    fontWeight: '700',
    color: '#FFF',
  },
});