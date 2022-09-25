import { DyDoc_BaseDocumentType, DyDoc_RecordType, DyDoc_TableDocumentBuilder } from "./types";

export type RecordTypeOf<T> =
  T extends DyDoc_TableDocumentBuilder<infer R> ? {
    [k in keyof DyDoc_RecordType<R>]: DyDoc_RecordType<R>[k]
  } : 'T must be DyDoc_TableDocumentBuilder: Call finalizeTableSchema!';

export type BaseDocumentType = DyDoc_BaseDocumentType;