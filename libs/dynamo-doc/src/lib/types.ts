type DyDoc_ColumnType = 'String' | 'Number' | 'Binary';
type DyDoc_ColumnTypeForKey = 'String' | 'Number';
type DyDoc_ColumnIsRequired = 'Optional' | 'Required';
type DyDoc_ColumnConf = `${DyDoc_ColumnIsRequired}${DyDoc_ColumnType}`;
type DyDoc_ColumnConfForPrimaryKey = `Required${DyDoc_ColumnTypeForKey}`;
type DyDoc_ColumnConfForSecondaryKey = `${DyDoc_ColumnIsRequired}${DyDoc_ColumnTypeForKey}`;


type DyDoc_PrimaryKeyConfiguration<
T_pk extends DyDoc_ColumnConfForPrimaryKey,
T_sk extends DyDoc_ColumnConfForPrimaryKey
> = {
  pk: T_pk;
  sk?: T_sk;
}

type DyDoc_SecondaryKeyConfiguration<
T_pk extends DyDoc_ColumnConfForSecondaryKey,
T_sk extends DyDoc_ColumnConfForSecondaryKey
> = {
  pk: T_pk;
  sk?: T_sk;
}

type DyDoc_TableConfiguration = {
  attributes: { [k: string]: DyDoc_ColumnConf },
  gsi: string[],
  lsi: string[],
  documents: { [documentType: string]: unknown },
}

type DyDoc_RecordType<
  T_table extends DyDoc_TableConfiguration,
> = {
  [
    k in keyof T_table['attributes']
    as T_table['attributes'][k] extends `Required${string}` ? k : never
  ]:
  T_table['attributes'][k] extends `RequiredString` ? string
      : T_table['attributes'][k] extends `RequiredNumber` ? number
        : never;
} & {
  [
    k in keyof T_table['attributes']
    as T_table['attributes'][k] extends `Optional${string}` ? k : never
  ]?:
  T_table['attributes'][k] extends `OptionalString` ? string
      : T_table['attributes'][k] extends `OptionalNumber` ? number
        : never;
}

export type DyDoc_TableBuilder = {
  createTable<
    T_pk extends DyDoc_ColumnConfForPrimaryKey,
    T_sk extends DyDoc_ColumnConfForPrimaryKey,
    T_keyConfiguration extends DyDoc_PrimaryKeyConfiguration<T_pk, T_sk>
  >(config: T_keyConfiguration): DyDoc_TableSchemaBuilder<{
    attributes: {
      [k in keyof T_keyConfiguration & string as Uppercase<k>]: T_keyConfiguration[k] extends DyDoc_ColumnConf ? T_keyConfiguration[k] : never
    },
    gsi: [],
    lsi: [],
    documents: { [k in never]: never };
  }>;
};

/**
 * DyDoc_TableSchemaBuilder
 * 
 * User can specify columns for GSIs, LSIs and TTLs
 */
type DyDoc_TableSchemaBuilder<
  T_table extends DyDoc_TableConfiguration,
> = {
  addGlobalSecondaryIndex<
    T_name extends string,
    T_pk extends DyDoc_ColumnConfForSecondaryKey,
    T_sk extends DyDoc_ColumnConfForSecondaryKey,
    T_keyConfiguration extends DyDoc_SecondaryKeyConfiguration<T_pk, T_sk>
  >(
    name: T_name extends T_table['gsi'][number] ? `GSI '${T_name}' already exists!` : T_name,
    config: T_keyConfiguration
  ): DyDoc_TableSchemaBuilder<{
    attributes: T_table['attributes'] & {
      [
        k in keyof T_keyConfiguration & string
        as `GSI_${T_name}_${Uppercase<k>}`
      ]: T_keyConfiguration[k] extends DyDoc_ColumnConf 
        ? T_keyConfiguration[k]
        : never
    },
    gsi: [...T_table['gsi'], T_name],
    lsi: [...T_table['lsi']],
    documents: { [k in never]: never };
  }>;

  finalizeTableSchema(): DyDoc_TableDocumentBuilder<T_table>;
};

type DyDoc_BaseDocumentType = {
  documentType: string;
};

type DyDoc_TableDocumentBuilder<
  T_table extends DyDoc_TableConfiguration,
  > = {
  addDocumentType<
    T_DocumentInterface extends DyDoc_BaseDocumentType
  >(
    mapping: (document: T_DocumentInterface) => DyDoc_RecordType<T_table>[]
  ): DyDoc_TableDocumentBuilder<{
    attributes: T_table['attributes'],
    gsi: T_table['gsi'],
    lsi: T_table['lsi'],
    documents: T_table['documents'] & {
      [key in T_DocumentInterface['documentType']]: (document: T_DocumentInterface) => DyDoc_RecordType<T_table>[]
    }
  }>;
};

interface User extends DyDoc_BaseDocumentType {
  documentType: 'user';
  userId: string;
  tenantIds: string[];
  name: string;
  age: number;
}

interface UserGroup extends DyDoc_BaseDocumentType {
  documentType: 'user-group';
  tenantId: string;
  groupId: string;
  userIds: string[];
}

declare const tableBuilder: DyDoc_TableBuilder;

const myTable = tableBuilder
  .createTable({ pk: 'RequiredString', sk: 'RequiredString' })
  .addGlobalSecondaryIndex('1', { pk: 'RequiredString' })
  .addGlobalSecondaryIndex('2', { pk: 'OptionalString' })
  .finalizeTableSchema()
  .addDocumentType((document: User) => ([
    {
      PK: `USER#${document.userId}`,
      SK: `DETAILS`,
      GSI_1_PK: `` // Not needed here
    },
    ...document.tenantIds.map((tenantId) => ({
      PK: `TENANT#${tenantId}`,
      SK: `USER#${document.userId}`,
      GSI_1_PK: `` // Not needed here
    }))
  ]))
  .addDocumentType((document: UserGroup) => ([
    {
      PK: `TENANT#${document.tenantId}`,
      SK: `USER_GROUP#${document.groupId}`,
      GSI_1_PK: `USER_GROUP#${document.groupId}`
    },
    ...document.userIds.map((userId) => ({
      PK: `TENANT#${document.tenantId}`,
      SK: `USER#${userId}#USER_GROUP#${document.groupId}`,
      GSI_1_PK: `USER_GROUP#${document.groupId}`
    }))
  ]))