import { isRecord } from 'src/utils/is-record';
import { PgErrorCode } from './pg-code.enum';

export interface DatabaseError {
  code: PgErrorCode;
  detail: string;
  table: string;
  column?: string;
}

export const isDatabaseError = (value: unknown): value is DatabaseError => {
  if (!isRecord(value)) return false;

  const { code, detail, table } = value;

  return Boolean(code && detail && table);
};
