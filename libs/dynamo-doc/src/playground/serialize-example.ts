interface GroupDocument {
  tenantId: string;
  groupId: string;
  users: string[];
}

interface MyTableSchema {
  pk: string;
  sk: string;
  content: string;
  ttl?: number;
}

const serialize = (group: GroupDocument): MyTableSchema[] => {
  const mainRecord: MyTableSchema = {
    content: JSON.stringify(group),
    pk: `tenant#${group.tenantId}`,
    sk: `group#${group.groupId}`,
  }

  const relationRecord: MyTableSchema[] = group.users.map(userId => ({
    content: '',
    pk: `tenant#${group.tenantId}`,
    sk: `user#${userId}#group#${group.groupId}`
  }))


  return [
    mainRecord,
    ...relationRecord,
  ]
}

console.log('READED FROM DB',serialize({
  groupId: 'group_001',
  tenantId: 'tenant_001',
  users: [
    'user_001',
    'user_002'
  ]
}))


console.log('DOCUMENT TO UPDATE',serialize({
  groupId: 'group_001',
  tenantId: 'tenant_001',
  users: [
    'user_001',
  ]
}))