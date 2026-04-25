# Live Defense: KYMA 편

도심 게릴라 라이브 무대를 지키는 2D Canvas 생존 디펜스 게임 MVP입니다.

## 시작 링크

- 로컬 개발 서버: http://127.0.0.1:5173
- GitHub Pages 배포 후: `https://<github-username>.github.io/live-defense-kyma/`

GitHub Pages에서는 저장소 이름을 `live-defense-kyma`로 쓰는 것을 기준으로 위 링크를 사용하면 됩니다.

## 실행

```bash
npm install
npm run dev
```

Windows PowerShell 실행 정책으로 `npm`이 막히는 경우:

```bash
npm.cmd install
npm.cmd run dev
```

## 빌드

```bash
npm run build
```

빌드 결과물은 `dist/`에 생성됩니다. Vite 설정의 `base`가 `./`라서 GitHub Pages 같은 정적 호스팅에서도 상대 경로로 동작합니다.

## 게임 조작

- 방향키: 이동
- 자동 평타: 가장 가까운 악성 팬 타격
- Q: 팬서비스 오라
- W: 라이트 쇼
- E: 아이돌 스텝
- R: KYMA 라이브
- ESC: 일시정지 메뉴

## 오디오 에셋

미리 준비된 오디오 경로:

```text
public/audio/
  bgm.mp3
  hit.ogg
  cllick.ogg
```

현재 코드는 위 파일명이 존재하면 자동으로 사용합니다. `cllick.ogg`는 요청한 파일명 그대로 연결해두었습니다.

## 캐릭터 에셋

캐릭터 이미지는 아래 폴더에 넣으면 됩니다.

```text
public/assets/characters/
  kyma/
  enemies/
```

탑뷰 액션 게임이라 최종적으로는 8방향이 가장 자연스럽습니다. MVP나 임시 에셋은 4방향으로도 충분하고, 좌우 반전이 가능한 그림이면 오른쪽 계열만 그리고 왼쪽은 코드에서 미러링하는 방식도 가능합니다.

## MVP 포함 사항

- 메인 화면, 게임 화면, HUD
- Canvas 2D 기반 게임 루프
- 악성 팬 스폰, 자동 공격, 경험치, 레벨업
- Q/W/E/R 스킬 해금 및 사용
- 중간 보스와 최종 보스
- 게임오버와 클리어 화면
- JSON 저장/불러오기
- 세팅, 도움말, 정보 패널
- 건물 충돌 판정

## GitHub Pages 배포 메모

1. GitHub 저장소에 코드를 push합니다.
2. `npm run build`로 `dist/`를 생성합니다.
3. GitHub Pages 배포 방식에 맞춰 `dist/`를 게시합니다.
4. 배포 후 시작 링크는 `https://<github-username>.github.io/live-defense-kyma/` 형식입니다.
