# Live Defense: KYMA 편

도심 게릴라 라이브 무대를 지키는 2D Canvas 생존 디펜스 게임입니다.  
KYMA가 무대 코어를 지키며 몰려오는 악성 팬을 막고, 팬심을 모아 라이브 스킬로 위기를 넘기는 팬게임 프로토타입입니다.

## 시작 링크
https://fatking25.github.io/livedefence/

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
- 자동 평타: 가장 가까운 악성 팬에게 반짝 음표 발사
- Q: 팬서비스 오라
- W: 라이트 쇼
- E: 아이돌 스텝
- R: KYMA 라이브
- ESC: 일시정지 메뉴

## 현재 구현 상태

- React + TypeScript + Vite 기반 정적 웹 게임
- Canvas 2D 게임 루프
- 도심형 맵, 충돌 건물, 도로, 횡단보도, 역 출구, 버스정류장
- KYMA 이동, 자동 평타, 투사체 충돌
- 악성 팬 스폰, 추적, 공격
- 진짜 팬 NPC와 팬심 보너스
- 경험치 드랍, 자동 흡수, 레벨업 선택지
- Q/W/E/R 스킬 해금과 쿨타임
- 중간 보스, 최종 보스, 클리어/게임오버
- JSON 저장/불러오기
- 세팅, 도움말, 정보 패널
- BGM/SFX 파일 연결 준비

## 오디오 에셋

아래 경로에 파일을 넣으면 코드가 자동으로 사용합니다.

```text
public/audio/
  bgm.mp3
  hit.ogg
  cllick.ogg
```

참고: `cllick.ogg`는 현재 요청된 파일명 그대로 연결되어 있습니다. 나중에 `click.ogg`로 고치고 싶으면 `src/game/audio.ts`의 경로만 함께 바꾸면 됩니다.

## 캐릭터 에셋

캐릭터 이미지는 아래 폴더에 넣으면 됩니다.

```text
public/assets/characters/
  kyma/
  enemies/
```

추천 방향 수:

- MVP: 4방향으로 충분
- 최종 목표: 8방향 추천
- 좌우 반전이 자연스러운 그림체라면 오른쪽 계열만 그리고 왼쪽은 코드에서 미러링 가능

권장 파일명 예시:

```text
public/assets/characters/kyma/
  idle_down.png
  idle_down_right.png
  idle_right.png
  idle_up_right.png
  idle_up.png

public/assets/characters/enemies/
  normal_down.png
  charger_down.png
  camera_down.png
  obsessed_down.png
  mid_boss_down.png
  final_boss_down.png
```

## 맵 디자인 방향

현재 맵은 당산역 주변 느낌의 도심형 게릴라 라이브 장소를 임시 도형으로 표현합니다.

- 중앙: 무대 코어와 작은 라이브 광장
- 상단/우측: 역 출구와 버스정류장
- 좌측: 상가 골목
- 하단: 횡단보도와 넓은 도로
- 건물: 충돌 가능한 장애물
- 간판/가로등/창문: 분위기용 장식

다음 단계에서는 실제 이미지 타일이나 스프라이트로 교체하기 쉽게 맵 데이터를 더 분리할 예정입니다.

## 다음 개선 후보

1. 적이 건물에 막혔을 때 더 자연스럽게 우회하도록 이동 AI 개선
2. 코어 HP 위험 시 화면 테두리 점멸, 경고음, HUD 강조
3. KYMA와 악성 팬 캐릭터 스프라이트 로더 추가
4. 악성 팬 타입별 아이콘 강화
5. GitHub Pages 자동 배포 워크플로우 추가
6. 실제 BGM/SFX 파일 적용 후 볼륨 밸런싱

## GitHub Pages 배포 메모

1. GitHub 저장소에 코드를 push합니다.
2. `npm run build`로 `dist/`를 생성합니다.
3. GitHub Pages 배포 방식에 맞춰 `dist/`를 게시합니다.
4. 저장소명이 `livedefence`라면 배포 링크는 `https://<github-username>.github.io/livedefence/` 형식입니다.
