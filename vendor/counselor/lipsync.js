/**
 * lipsync.js — 한국어 텍스트 → 입모양(viseme) 타임라인 엔진 (DOM 비의존, 순수 모듈)
 *
 * 역할: TTS로 들어올(현재는 텍스트 입력으로 받는) 한국어 문장을 받아
 *       시간축 위의 "입 블렌드셰이프 포즈" 키프레임 타임라인으로 변환한다.
 *       렌더링/표정/깜빡임/머리 움직임은 counselor.html이 담당하고,
 *       이 파일은 오직 "무엇을, 언제, 어떤 입모양으로" 만 계산한다.
 *
 * 설계 메모:
 *  - 한글 음절을 초성/중성/종성으로 분해한다.
 *  - 입모양(시각)은 사실상 "모음(중성)"이 지배한다 → 모음별 viseme 포즈를 정의.
 *  - 자음 중 시각적으로 가장 중요한 건 양순음(ㅁ/ㅂ/ㅍ): 입술이 완전히 닫힘 → 폐쇄 키프레임 삽입.
 *  - 그 외 자음은 모음 직전에 입을 살짝 닫았다 여는 "온셋 더킹"으로 근사.
 *  - 받침이 양순음이면 음절 끝에서 다시 입술을 닫는다.
 *  - 실제 오디오가 없으므로 음절 길이를 균등 추정(말속도 rate)으로 타이밍을 만든다.
 *    추후 외부 TTS 오디오를 붙이면 진폭으로 jawOpen을 모듈레이션하도록 player가 확장한다.
 */

// 이 엔진이 직접 제어하는 "입" 관련 ARKit 블렌드셰이프(이 키들만 다룬다)
export const MOUTH_KEYS = [
  'jawOpen',
  'mouthClose',
  'mouthPucker',
  'mouthFunnel',
  'mouthSmileLeft', 'mouthSmileRight',
  'mouthStretchLeft', 'mouthStretchRight',
  'mouthLowerDownLeft', 'mouthLowerDownRight',
  'mouthPressLeft', 'mouthPressRight',
  'mouthUpperUpLeft', 'mouthUpperUpRight',
];

// 입을 "쉼/닫힘"으로 둘 때의 기본 포즈(중립). 따뜻한 미소는 표정 레이어가 별도로 얹는다.
export const REST_POSE = {};

// ── 모음/자음 viseme 프리셋 ───────────────────────────────────────────────
// 값은 0~1. 한 모음의 "정점(peak)"에서의 입 모양.
const VIS = {
  // 침묵/입술 폐쇄(양순음 ㅁㅂㅍ): 입을 다물고 살짝 누름
  CLOSE: { jawOpen: 0.0, mouthClose: 0.72, mouthPressLeft: 0.35, mouthPressRight: 0.35 },
  // 아 (ㅏ): 크게 벌림
  AA: { jawOpen: 0.55, mouthLowerDownLeft: 0.12, mouthLowerDownRight: 0.12, mouthStretchLeft: 0.10, mouthStretchRight: 0.10 },
  // 어 (ㅓ): 중간 벌림
  AH: { jawOpen: 0.42, mouthLowerDownLeft: 0.08, mouthLowerDownRight: 0.08 },
  // 에/애 (ㅔㅐ): 옆으로 벌어진 중간
  EH: { jawOpen: 0.30, mouthStretchLeft: 0.26, mouthStretchRight: 0.26, mouthSmileLeft: 0.12, mouthSmileRight: 0.12 },
  // 이 (ㅣ): 거의 닫고 옆으로 길게
  IH: { jawOpen: 0.14, mouthSmileLeft: 0.30, mouthSmileRight: 0.30, mouthStretchLeft: 0.16, mouthStretchRight: 0.16 },
  // 오 (ㅗ): 둥글게
  OH: { jawOpen: 0.30, mouthPucker: 0.45, mouthFunnel: 0.38 },
  // 우 (ㅜ): 둥글고 좁게
  OO: { jawOpen: 0.13, mouthPucker: 0.72, mouthFunnel: 0.30 },
  // 으 (ㅡ): 거의 닫고 살짝 옆으로
  EU: { jawOpen: 0.12, mouthStretchLeft: 0.12, mouthStretchRight: 0.12, mouthClose: 0.10 },
};

// 중성(21개) 인덱스 → viseme. 문자열이면 단일 모음, {v, r:1}이면 원순(w/오) 활음 온셋.
// 순서: ㅏㅐㅑㅒㅓㅔㅕㅖㅗㅘㅙㅚㅛㅜㅝㅞㅟㅠㅡㅢㅣ
const JUNG_VIS = [
  'AA',            // 0  ㅏ
  'EH',            // 1  ㅐ
  'AA',            // 2  ㅑ  (ya → a)
  'EH',            // 3  ㅒ  (yae → e)
  'AH',            // 4  ㅓ
  'EH',            // 5  ㅔ
  'AH',            // 6  ㅕ  (yeo → eo)
  'EH',            // 7  ㅖ  (ye → e)
  'OH',            // 8  ㅗ
  { v: 'AA', r: 1 }, // 9  ㅘ  (wa)
  { v: 'EH', r: 1 }, // 10 ㅙ  (wae)
  { v: 'EH', r: 1 }, // 11 ㅚ  (oe)
  'OH',            // 12 ㅛ  (yo → o)
  'OO',            // 13 ㅜ
  { v: 'AH', r: 1 }, // 14 ㅝ  (wo)
  { v: 'EH', r: 1 }, // 15 ㅞ  (we)
  { v: 'IH', r: 1 }, // 16 ㅟ  (wi)
  'OO',            // 17 ㅠ  (yu → u)
  'EU',            // 18 ㅡ
  'IH',            // 19 ㅢ  (ui → i 근사)
  'IH',            // 20 ㅣ
];

// 초성(19개) 중 양순음: ㅁ(6) ㅂ(7) ㅃ(8) ㅍ(17)
const CHO_BILABIAL = new Set([6, 7, 8, 17]);
// 초성 ㅇ(11)은 음가 없음(모음만)
const CHO_SILENT = 11;
// 종성(28개) 중 입술을 닫는 받침: ㄻ(10) ㅁ(16) ㅂ(17) ㅄ(18) ㅍ(26)
const JONG_BILABIAL = new Set([10, 16, 17, 18, 26]);

// ── 포즈 유틸 ─────────────────────────────────────────────────────────────
function scalePose(p, k) {
  const o = {};
  for (const key in p) o[key] = p[key] * k;
  return o;
}
function mixPose(a, b, t) {
  const o = {};
  const keys = new Set([...Object.keys(a), ...Object.keys(b)]);
  for (const k of keys) o[k] = (a[k] || 0) * (1 - t) + (b[k] || 0) * t;
  return o;
}

/**
 * 한글 음절 분해. 완성형(가~힣)만 분해, 그 외엔 null.
 * @returns {{cho:number, jung:number, jong:number}|null}
 */
export function decomposeHangul(ch) {
  const code = ch.charCodeAt(0);
  if (code < 0xac00 || code > 0xd7a3) return null;
  const s = code - 0xac00;
  return { cho: Math.floor(s / 588), jung: Math.floor((s % 588) / 28), jong: s % 28 };
}

/**
 * 한국어 텍스트 → 입모양 타임라인.
 * @param {string} text
 * @param {{rate?:number}} opts  rate = 초당 음절 수(말속도). 기본 5.
 * @returns {{keys:Array<{t:number,pose:object}>, sylls:Array<{t0:number,t1:number,ci:number}>, marks:Array<{t:number,type:string}>, duration:number}}
 */
export function buildTimeline(text, opts = {}) {
  const rate = Math.max(1.5, Math.min(10, opts.rate ?? 5));
  const d = 1 / rate; // 음절 1개의 기본 길이(초)

  const keys = [];
  const sylls = [];
  const marks = [];
  let t = 0;
  const push = (tt, pose) => keys.push({ t: tt, pose });

  push(0, REST_POSE); // 시작은 입 닫힘

  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    const dec = decomposeHangul(ch);

    if (dec) {
      const vinfo = JUNG_VIS[dec.jung];
      const vkey = typeof vinfo === 'string' ? vinfo : vinfo.v;
      const round = typeof vinfo === 'object' && vinfo.r === 1;
      const vowel = VIS[vkey] || VIS.AH;

      const bilabialOnset = CHO_BILABIAL.has(dec.cho);
      const silentOnset = dec.cho === CHO_SILENT;
      const finalClose = JONG_BILABIAL.has(dec.jong);

      const t0 = t, t1 = t + d;

      // 온셋 포즈(자음 영향)
      let onset;
      if (bilabialOnset) onset = VIS.CLOSE;            // 입술 폐쇄로 시작
      else if (silentOnset) onset = scalePose(vowel, 0.72); // ㅇ: 거의 모음
      else onset = scalePose(vowel, 0.45);             // 일반 자음: 살짝 닫았다 열기
      if (round) onset = mixPose(onset, VIS.OO, 0.6);  // 원순 활음(와/워/위...)

      push(t0, onset);
      push(t0 + 0.42 * d, vowel);          // 모음 정점
      push(t0 + 0.75 * d, scalePose(vowel, 0.9)); // 유지
      push(t1, finalClose ? VIS.CLOSE : scalePose(vowel, 0.5)); // 종료(받침 폐쇄/이완)

      sylls.push({ t0, t1, ci: i });
      t = t1;
    } else if (ch === ' ' || ch === '\t') {
      push(t, REST_POSE); t += d * 0.5; push(t, REST_POSE);
    } else if (ch === '\n') {
      push(t, REST_POSE); marks.push({ t, type: 'period' }); t += d * 1.0; push(t, REST_POSE);
    } else if ('.!?…'.includes(ch)) {
      push(t, REST_POSE);
      marks.push({ t, type: ch === '?' ? 'question' : ch === '!' ? 'exclaim' : 'period' });
      t += d * 1.2; push(t, REST_POSE);
    } else if (',、;:·'.includes(ch)) {
      push(t, REST_POSE); marks.push({ t, type: 'comma' }); t += d * 0.6; push(t, REST_POSE);
    } else if (/[0-9A-Za-z]/.test(ch)) {
      // 숫자/영문: 가벼운 일반 음절로 근사(입을 적당히 움직임)
      const t0 = t, t1 = t + d;
      push(t0, scalePose(VIS.AH, 0.5));
      push(t0 + 0.45 * d, VIS.AH);
      push(t1, scalePose(VIS.AH, 0.4));
      sylls.push({ t0, t1, ci: i });
      t = t1;
    } else {
      // 기타 기호: 아주 짧은 쉼
      push(t, REST_POSE); t += d * 0.3;
    }
  }
  push(t + 0.06, REST_POSE); // 마무리 입 닫힘

  return { keys, sylls, marks, duration: t };
}

/**
 * 타임라인에서 시각 t의 입 포즈를 선형보간으로 샘플.
 * @param {Array<{t:number,pose:object}>} keys  (시간 오름차순)
 * @param {number} tt
 * @returns {object} 포즈(블렌드셰이프명→값)
 */
export function samplePose(keys, tt) {
  const n = keys.length;
  if (n === 0) return {};
  if (tt <= keys[0].t) return { ...keys[0].pose };
  if (tt >= keys[n - 1].t) return { ...keys[n - 1].pose };
  let i = 1;
  while (i < n && keys[i].t < tt) i++;
  const a = keys[i - 1], b = keys[i];
  const span = (b.t - a.t) || 1e-6;
  const u = Math.max(0, Math.min(1, (tt - a.t) / span));
  return mixPose(a.pose, b.pose, u);
}

// 현재 음절 인덱스(자막 하이라이트용). 없으면 -1.
export function currentSyllable(sylls, tt) {
  for (let i = 0; i < sylls.length; i++) {
    if (tt >= sylls[i].t0 && tt < sylls[i].t1) return i;
  }
  return -1;
}
