/**
 * Nói lái: hoán đổi phần vần + thanh điệu giữa hai tiếng, giữ nguyên phụ âm đầu.
 *   phương vắc -> phắc vương
 */

const TONE_MARKS = ['\u0300', '\u0301', '\u0303', '\u0309', '\u0323'] as const
const TONE_RE = /[\u0300\u0301\u0303\u0309\u0323]/g

// Phụ âm đầu, xếp dài trước ngắn để khớp đúng (ngh trước ng, ...)
const ONSETS = [
  'ngh',
  'ng',
  'nh',
  'ph',
  'th',
  'tr',
  'ch',
  'gh',
  'gi',
  'kh',
  'qu',
  'b',
  'c',
  'd',
  'đ',
  'g',
  'h',
  'k',
  'l',
  'm',
  'n',
  'p',
  'q',
  'r',
  's',
  't',
  'v',
  'x',
]

const VOWELS = 'aăâeêioôơuưy'
const DIACRITIC_VOWELS = 'ăâêôơư'
const CLOSED_FINALS = ['ng', 'nh', 'ch', 'c', 'm', 'n', 'p', 't']

export interface Syllable {
  onset: string
  rime: string // vần, không dấu thanh
  tone: number // 0 = ngang, 1..5 = huyền, sắc, ngã, hỏi, nặng (theo TONE_MARKS)
}

const isVowel = (ch: string) => VOWELS.includes(ch)

export function parseSyllable(raw: string): Syllable | null {
  const lower = raw.toLowerCase().normalize('NFD')
  const toneMark = lower.match(TONE_RE)?.[0]
  const tone = toneMark
    ? TONE_MARKS.indexOf(toneMark as (typeof TONE_MARKS)[number]) + 1
    : 0
  const base = lower.replace(TONE_RE, '').normalize('NFC')

  if (!base || ![...base].some(isVowel)) return null

  let onset = ''
  for (const o of ONSETS) {
    if (base.startsWith(o)) {
      onset = o
      break
    }
  }
  // "gì", "gìn": chữ i là nguyên âm, onset chỉ là "g"
  if (onset === 'gi' && ![...base.slice(2)].some(isVowel)) onset = 'g'

  const rime = base.slice(onset.length)
  if (!rime || !isVowel(rime[0])) return null
  return { onset, rime, tone }
}

/** Đặt dấu thanh lên đúng nguyên âm (kiểu mới: hòa, thủy). */
function placeTone(rime: string, tone: number): string {
  if (tone === 0) return rime
  const chars = [...rime]

  let end = chars.length
  const hasFinal =
    CLOSED_FINALS.some((f) => rime.endsWith(f)) && !isVowel(chars[end - 1])
  while (end > 0 && !isVowel(chars[end - 1])) end--
  let start = 0
  while (start < end && !isVowel(chars[start])) start++
  const vowelIdx = Array.from({ length: end - start }, (_, i) => start + i)

  let target = vowelIdx[vowelIdx.length - 1]
  const diacritic = [...vowelIdx]
    .reverse()
    .find((i) => DIACRITIC_VOWELS.includes(chars[i]))

  if (diacritic !== undefined) {
    target = diacritic
  } else if (vowelIdx.length === 3) {
    target = vowelIdx[1]
  } else if (vowelIdx.length === 2) {
    const pair = chars[vowelIdx[0]] + chars[vowelIdx[1]]
    const secondForOpen = ['oa', 'oe', 'uy'].includes(pair)
    target = hasFinal || secondForOpen ? vowelIdx[1] : vowelIdx[0]
  }

  chars[target] = (chars[target] + TONE_MARKS[tone - 1]).normalize('NFC')
  return chars.join('')
}

/** Ghép onset + rime + tone, sửa chính tả c/k, g/gh, ng/ngh và "qu". */
function build(onset: string, rime: string, tone: number): string {
  let o = onset
  let r = rime
  const front = r[0]
  const soft = 'eêiy'.includes(front)

  if (o === 'c' || o === 'k') o = soft ? 'k' : 'c'
  else if (o === 'g' || o === 'gh') o = soft ? 'gh' : 'g'
  else if (o === 'ng' || o === 'ngh') o = soft ? 'ngh' : 'ng'
  else if (
    o === 'qu' &&
    (r.startsWith('o') || r.startsWith('u')) &&
    r.length > 1 &&
    isVowel(r[1])
  ) {
    r = r.slice(1) // quoa -> qua
  }
  return o + placeTone(r, tone)
}

function matchCase(source: string, result: string): string {
  if (source.length > 1 && source === source.toUpperCase())
    return result.toUpperCase()
  if (source[0] !== source[0].toLowerCase())
    return result[0].toUpperCase() + result.slice(1)
  return result
}

export interface NoiLaiOptions {
  /** true: giữ dấu thanh tại chỗ thay vì đi theo vần. Mặc định false. */
  keepTone?: boolean
}

/** Nói lái một cặp tiếng. Trả về null nếu không phải tiếng Việt hợp lệ. */
export function noiLaiPair(
  a: string,
  b: string,
  options: NoiLaiOptions = {},
): [string, string] | null {
  const sa = parseSyllable(a)
  const sb = parseSyllable(b)
  if (!sa || !sb) return null
  // keepTone: dấu thanh ở yên tại chỗ, chỉ đổi phần vần (chú lo -> chó lu)
  const toneA = options.keepTone ? sa.tone : sb.tone
  const toneB = options.keepTone ? sb.tone : sa.tone
  return [
    matchCase(a, build(sa.onset, sb.rime, toneA)),
    matchCase(b, build(sb.onset, sa.rime, toneB)),
  ]
}

export interface NoiLaiResult {
  /** Cặp tiếng gốc, vd "phương vắc" */
  source: string
  /** Kết quả, vd "phắc vương" */
  result: string
}

/**
 * Nói lái cả cụm. Với cụm 2 tiếng cho 1 kết quả;
 * với cụm dài hơn, lái từng cặp tiếng liền kề.
 */
export function noiLai(
  input: string,
  options: NoiLaiOptions = {},
): Array<NoiLaiResult> {
  const words = input.trim().split(/\s+/).filter(Boolean)
  const results: Array<NoiLaiResult> = []
  for (let i = 0; i < words.length - 1; i++) {
    const flipped = noiLaiPair(words[i], words[i + 1], options)
    if (!flipped) continue
    const next = [...words]
    next[i] = flipped[0]
    next[i + 1] = flipped[1]
    results.push({
      source: `${words[i]} ${words[i + 1]}`,
      result: next.join(' '),
    })
  }
  return results
}

/** Âm tiết kết thúc bằng c, ch, p, t chỉ mang dấu sắc hoặc nặng. */
function isValidSyllable(word: string): boolean {
  const s = parseSyllable(word)
  if (!s) return false
  const stopFinal = /(ch|c|p|t)$/.test(s.rime)
  return !stopFinal || s.tone === 2 || s.tone === 5
}

/** Giữ nguyên vần của mỗi tiếng, chỉ đổi dấu thanh cho nhau (Gia Bảo -> Giả Bao). */
export function noiLaiTonePair(a: string, b: string): [string, string] | null {
  const sa = parseSyllable(a)
  const sb = parseSyllable(b)
  if (!sa || !sb) return null
  return [
    matchCase(a, build(sa.onset, sa.rime, sb.tone)),
    matchCase(b, build(sb.onset, sb.rime, sa.tone)),
  ]
}

export interface NoiLaiVariant {
  kind:
    | 'theoVan'
    | 'theoVanDao'
    | 'giuDau'
    | 'giuDauDao'
    | 'doiDau'
    | 'doiDauDao'
  label: string
  result: string
}

export interface NoiLaiGroup {
  /** Cặp tiếng được lái, vd "chú lo" */
  source: string
  variants: Array<NoiLaiVariant>
}

/**
 * Mọi trường hợp có thể xảy ra: với mỗi cặp tiếng (kể cả không liền kề),
 * kết hợp {dấu đi theo vần, giữ dấu tại chỗ} x {giữ thứ tự, đảo thứ tự}.
 * Bỏ kết quả trùng nhau và kết quả không đổi gì so với câu gốc.
 */
export function noiLaiAll(input: string): Array<NoiLaiGroup> {
  const words = input.trim().split(/\s+/).filter(Boolean)
  const groups: Array<NoiLaiGroup> = []

  for (let i = 0; i < words.length - 1; i++) {
    for (let j = i + 1; j < words.length; j++) {
      const byRime = noiLaiPair(words[i], words[j])
      const byPlace = noiLaiPair(words[i], words[j], { keepTone: true })
      const byTone = noiLaiTonePair(words[i], words[j])
      if (!byRime || !byPlace || !byTone) continue

      const apply = (pair: [string, string], swap: boolean) => {
        const next = [...words]
        next[i] = swap ? pair[1] : pair[0]
        next[j] = swap ? pair[0] : pair[1]
        return next.join(' ')
      }

      const candidates: Array<
        Omit<NoiLaiVariant, 'result'> & {
          pair: [string, string]
          swap: boolean
          onlyValid?: boolean
        }
      > = [
        {
          kind: 'theoVan',
          label: 'Dấu đi theo vần',
          pair: byRime,
          swap: false,
        },
        { kind: 'theoVanDao', label: 'Đảo thứ tự', pair: byRime, swap: true },
        {
          kind: 'giuDau',
          label: 'Giữ dấu tại chỗ',
          pair: byPlace,
          swap: false,
        },
        {
          kind: 'giuDauDao',
          label: 'Giữ dấu, đảo thứ tự',
          pair: byPlace,
          swap: true,
        },
        // đổi dấu thường ra âm tiết không tồn tại (học -> hoc), nên chỉ giữ kết quả hợp lệ
        {
          kind: 'doiDau',
          label: 'Đổi dấu, giữ vần',
          pair: byTone,
          swap: false,
          onlyValid: true,
        },
        {
          kind: 'doiDauDao',
          label: 'Đổi dấu, đảo thứ tự',
          pair: byTone,
          swap: true,
          onlyValid: true,
        },
      ]

      const seen = new Set<string>()
      const variants: Array<NoiLaiVariant> = []
      for (const c of candidates) {
        // hai tiếng không đổi gì so với gốc (chỉ có thể đảo chỗ) thì không phải nói lái
        if (c.pair[0] === words[i] && c.pair[1] === words[j]) continue
        if (
          c.onlyValid &&
          !(isValidSyllable(c.pair[0]) && isValidSyllable(c.pair[1]))
        )
          continue
        const result = apply(c.pair, c.swap)
        if (result === words.join(' ') || seen.has(result)) continue
        seen.add(result)
        variants.push({ kind: c.kind, label: c.label, result })
      }

      if (variants.length > 0) {
        groups.push({ source: `${words[i]} ${words[j]}`, variants })
      }
    }
  }
  return groups
}
