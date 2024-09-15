import { hasProperty } from '../_internal';
import { SUSA_MAP, SUSA_CLASSIFIER_MAP } from './constants';

/**
 * 숫자를 순 우리말 수사로 변환합니다. 주어진 숫자가 0보다 크고 100 이하일 때 유효합니다.
 * @param num 숫자를 입력합니다.
 * @param classifier 수관형사를 사용할지 여부를 입력합니다. 기본값은 false입니다.
 * @returns 변환된 수사를 반환합니다.
 *
 * @example
 * susa(1); // '하나
 * susa(2); // '둘
 * susa(11); // '열하나
 * susa(21); // '스물하나
 * susa(99); // '아흔아홉
 * susa(100); // '백'
 * susa(1, true); // '한'
 * susa(2, true); // '두'
 * susa(11, true); // '열한'
 * susa(20, true); // '스무'
 * susa(21, true); // '스물한'
 *
 * @see https://es-hangul.slash.page/docs/api/susa
 */
export function susa(num: number, classifier?: boolean): string {
  validateNumber(num);
  return classifier ? getClassifierWord(num) : getNumberWord(num);
}

function getClassifierWord(num: number): string {
  if (num === 20) {
    return SUSA_CLASSIFIER_MAP[num];
  }

  const tens = Math.floor(num / 10) * 10;
  const ones = num % 10;

  const tensWord = hasProperty(SUSA_MAP, tens) ? SUSA_MAP[tens] : '';

  if (ones === 0) {
    return tensWord;
  }

  if (hasProperty(SUSA_CLASSIFIER_MAP, ones)) {
    const onesWord = SUSA_CLASSIFIER_MAP[ones];

    return `${tensWord}${onesWord}`;
  }

  if (hasProperty(SUSA_MAP, ones)) {
    const onesWord = SUSA_MAP[ones];

    return `${tensWord}${onesWord}`;
  }

  // `susa`에서` `validateNumber` 하기 때문에 도달할 수 없는 분기입니다. 타입 추론을 위해 에러를 던져줍니다.
  throw new Error('지원하지 않는 숫자입니다.');
}

function validateNumber(num: number): void {
  if (Number.isNaN(num) || num <= 0 || num > 100 || !Number.isInteger(num) || !Number.isFinite(num)) {
    throw new Error('지원하지 않는 숫자입니다.');
  }
}

function getNumberWord(num: number): string {
  if (num === 100) {
    return SUSA_MAP[100];
  }

  const tens = Math.floor(num / 10) * 10;
  const ones = num % 10;

  const tensWord = hasProperty(SUSA_MAP, tens) ? SUSA_MAP[tens] : '';
  const onesWord = hasProperty(SUSA_MAP, ones) ? SUSA_MAP[ones] : '';

  return `${tensWord}${onesWord}`;
}
