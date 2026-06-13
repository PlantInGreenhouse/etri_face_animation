#!/usr/bin/env bash
# ─────────────────────────────────────────────────────────────────────────
# 얼굴 인식 모델(face_landmarker.task)을 vendor/mediapipe/ 에 내려받습니다.
# 최초 1회만 실행하면 됩니다(다운로드에 인터넷 필요).
#
# 폐쇄망 서버라면: 인터넷이 되는 PC에서 아래 URL 파일을 받아
#   vendor/mediapipe/face_landmarker.task  경로로 복사해 넣으면 됩니다.
# ─────────────────────────────────────────────────────────────────────────
set -e
cd "$(dirname "$0")"

URL="https://storage.googleapis.com/mediapipe-models/face_landmarker/face_landmarker/float16/1/face_landmarker.task"
OUT="vendor/mediapipe/face_landmarker.task"

mkdir -p vendor/mediapipe
echo "다운로드 중: $URL"

if command -v curl >/dev/null 2>&1; then
  curl -L --fail "$URL" -o "$OUT"
elif command -v wget >/dev/null 2>&1; then
  wget -O "$OUT" "$URL"
else
  echo "curl/wget이 없습니다. 브라우저로 위 URL을 열어 $OUT 로 저장하세요."
  exit 1
fi

echo "완료: $OUT ($(ls -lh "$OUT" | awk '{print $5}'))"
