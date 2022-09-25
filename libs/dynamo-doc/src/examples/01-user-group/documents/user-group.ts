import { BaseDocumentType } from '../../../index';
import { RecordType } from '../table-schema';


interface UserGroup extends BaseDocumentType {
  documentType: 'user-group';
  tenantId: string;
  groupId: string;
  userIds: string[];
}

export const userGroupSerializer = (document: UserGroup): RecordType[] => ([
  {
    PK: `TENANT#${document.tenantId}`,
    SK: `USER_GROUP#${document.groupId}`,
  },
  ...document.userIds.map((userId) => ({
    PK: `TENANT#${document.tenantId}`,
    SK: `USER#${userId}#USER_GROUP#${document.groupId}`,
  }))
])