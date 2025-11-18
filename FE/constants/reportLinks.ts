// 딥페이크 신고 관련 링크 모음
export const REPORT_LINKS = {
  NAVER_REPORT: {
    title: '네이버 신고센터',
    url: 'https://help.naver.com/service/30001/contents/23019?lang=ko&osType=COMMONOS',
  },
  NAVER_RIGHTS: {
    title: '네이버 권리보호 센터',
    url: 'https://right.naver.com/',
  },
  ECRM: {
    title: '사이버범죄 신고시스템 (ECRM)',
    url: 'https://ecrm.police.go.kr/minwon/main',
    emergency: '112',
    consultation: '182',
  },
};

export type ReportType = 'simple' | 'ecrm';