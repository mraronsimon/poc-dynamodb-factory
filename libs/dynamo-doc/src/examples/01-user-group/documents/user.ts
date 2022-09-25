import { BaseDocumentType } from '../../../index';
import { RecordType } from '../table-schema';

interface User extends BaseDocumentType {
  documentType: 'user';
  userId: string;
  tenantIds: string[];
  name: string;
  age: number;
}

export const userSerializer = (document: User): RecordType[] => ([
  {
    PK: `USER#${document.userId}`,
    SK: `DETAILS`,
  },
  ...document.tenantIds.map((tenantId) => ({
    PK: `TENANT#${tenantId}`,
    SK: `USER#${document.userId}`,
  }))
])
