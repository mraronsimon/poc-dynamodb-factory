import { TableBuilder, RecordTypeOf } from '../../index';

export const tableSchema = TableBuilder
  .createTable({ pk: 'RequiredString', sk: 'RequiredString' })
  .finalizeTableSchema()

export type RecordType = RecordTypeOf<typeof tableSchema>;