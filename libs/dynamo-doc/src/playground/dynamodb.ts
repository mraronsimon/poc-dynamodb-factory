type DDB_AttrType = 'String' | 'Number'; // | 'Binary'
// type IndexType = 'GSI' | 'LSI';
// type IndexKeyType = 'PK' | 'SK';

type DDB_KeyType = 'simple' | 'composite';

interface TableDescriptor {
  primaryKeyType: DDB_KeyType,
  attributes: {
    [attrName: string]: {
      type: DDB_AttrType;
      required: boolean;
    }
  }
}

type TableBuilder = {
  selectPrimaryKey<
    SelectedPrimaryKeyType extends DDB_KeyType,
    SelectedPartitionKeyType extends DDB_AttrType,
    SelectedShortKeyType extends SelectedPrimaryKeyType extends 'simple' ? never :  DDB_AttrType
  >(
    primaryKeyType: SelectedPrimaryKeyType,
    config: SelectedPrimaryKeyType extends 'simple' ? {
      partitionKeyType: SelectedPartitionKeyType,
    } : {
      partitionKeyType: SelectedPartitionKeyType,
      shortKeyType: SelectedShortKeyType
    }
  ): TableIndexBuilder<{
    primaryKeyType: SelectedPrimaryKeyType
    attributes: SelectedPrimaryKeyType extends 'simple'
      ? {
        PK: { type: SelectedPartitionKeyType, required: true }
      } : {
        PK: { type: SelectedPartitionKeyType, required: true }
        SK: { type: SelectedShortKeyType, required: true }
      }
  }>
}

type SelectedAttributeOptions<
  Table extends TableDescriptor,
> = Exclude<keyof Table['attributes'], 'PK'> | 'new';

type GSI_ColumnConfig<
  Table extends TableDescriptor,
  SelectedColumn extends SelectedAttributeOptions<Table>,
  SelectedAttrType extends DDB_AttrType,
  IsRequired extends boolean
> = {
  column: 'new',
  type: SelectedAttrType,
  required: IsRequired
} | {
  column: Exclude<SelectedColumn, 'new'>
}

type MergeObjects<T = { [key: string]: unknown }> = {
  [k in keyof T]: T[k] 
}

type TableIndexBuilder<Table extends { primaryKeyType: DDB_KeyType, attributes: { [attributeName: string]: { type: DDB_AttrType, required: boolean } } }> = {
  addGlobalSecondaryIndex<
    SelectedKeyType extends DDB_KeyType,
    SelectedName extends string,
    PK_SelectedAttrType extends DDB_AttrType,
    SK_SelectedAttrType extends DDB_AttrType,
    PK_IsRequired extends boolean,
    SK_IsRequired extends boolean,
    PK_SelectedColumn extends SelectedAttributeOptions<Table> = 'new',
    SK_SelectedColumn extends SelectedAttributeOptions<Table> = 'new',
  >(
    keyType: SelectedKeyType,
    name: SelectedName,
    config: SelectedKeyType extends 'simple' ? {
      pk: GSI_ColumnConfig<Table, PK_SelectedColumn, PK_SelectedAttrType, PK_IsRequired>
    } : {
      pk: GSI_ColumnConfig<Table, PK_SelectedColumn, PK_SelectedAttrType, PK_IsRequired>
      sk: GSI_ColumnConfig<Table, SK_SelectedColumn, SK_SelectedAttrType, SK_IsRequired>
    }
  ) : TableIndexBuilder<{
    primaryKeyType: Table['primaryKeyType'],
    attributes: {
      [
        attrName in (keyof Table['attributes']) & string
          as PK_SelectedColumn extends attrName
            ? `${attrName}#GSI_${SelectedName}_PK`
            : SK_SelectedColumn extends attrName
              ? `${attrName}#GSI_${SelectedName}_SK`
              : attrName

      ]: Table['attributes'][attrName]
    } 
    & {
      [attrName in 'PK' as PK_SelectedColumn extends 'new' ? `GSI_${SelectedName}_PK` : never]: {
        type: PK_SelectedAttrType,
        required: PK_IsRequired
      }
    } & {
      [attrName in 'SK' as SelectedKeyType extends 'composite' ? SK_SelectedColumn extends 'new' ? `GSI_${SelectedName}_SK` : never : never]: {
        type: SK_SelectedAttrType,
        required: SK_IsRequired
      }
    }
  }>
}

declare const tableBuilder: TableBuilder;

const table = tableBuilder
  .selectPrimaryKey('composite', { partitionKeyType: 'Number', shortKeyType: 'Number' })
  .addGlobalSecondaryIndex('composite', '1', {
    pk: { column: 'SK' },
    sk: { column: 'new', required: false, type: 'String' }
  })
  .addGlobalSecondaryIndex('simple', 'kiscica', {
    pk: { column: 'SK#GSI_1_PK' }
  })

