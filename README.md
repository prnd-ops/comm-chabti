# 차BTI · 나랑 맞는 차 찾기

성격 8문항으로 나와 맞는 차 유형(16종)을 찾아주는 웹 성격테스트.
빌드 과정 없는 **단일 HTML 파일**이라, 그대로 정적 호스팅하면 됩니다.

## 구성
| 파일 | 설명 |
|---|---|
| `index.html` | 테스트 본체 (모든 로직·스타일·이미지 내장) |
| `og.png` | 카카오톡/SNS 공유 썸네일 (1200×630) |
| `집계_AppsScript_Code.gs` | 설문 집계용 Google Apps Script 코드 |
| `집계_설정가이드.md` | 집계 연동 설정 가이드 (5분) |

## 배포 (GitHub Pages)
`index.html`과 `og.png`를 저장소 루트에 두고, Settings → Pages에서 `main` / `/(root)`로 배포합니다.
- 현재 도메인: https://prnd-ops.github.io/comm-chabti/
- 파일을 저장소에 업로드(커밋)하면 GitHub Pages가 자동으로 반영합니다.
> 도메인이 바뀌면 `index.html` 안의 `og:url` / `og:image` 주소도 함께 수정하세요.

## 공유 썸네일(og.png) 갱신
1. `og.png` 교체 후 배포
2. 카카오 캐시 초기화: https://developers.kakao.com/tool/debugger/sharing
3. 그래도 안 바뀌면 `index.html`의 `og.png?v=N` 버전 번호를 올리기 (`?v=4` → `?v=5` …)

## 설문 집계 (선택)
접속 수·완료 수·문항별 선택을 Google 시트로 수집할 수 있습니다.
- 설정 방법: `집계_설정가이드.md`
- `index.html`의 `TRACK_ENDPOINT` 에 배포된 Apps Script 웹앱 URL을 넣으면 동작합니다.

> ⚠️ `TRACK_ENDPOINT`는 데이터가 쌓이는 수집 주소입니다. 이 값은 라이브 사이트 소스에서도
> 보이므로 저장소 공개 여부와 무관하게 노출됩니다. 악용(가짜 데이터)이 우려되면 Apps Script
> 웹앱을 재배포해 URL을 교체하세요.
