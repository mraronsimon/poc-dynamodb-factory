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
  gsi: string[],
  lsi: string[],
  attributes: { [k: string]: DyDoc_ColumnConf }
}

export type DyDoc_TableBuilder = {
  createTable<
    T_pk extends DyDoc_ColumnConfForPrimaryKey,
    T_sk extends DyDoc_ColumnConfForPrimaryKey,
    T_keyConfiguration extends DyDoc_PrimaryKeyConfiguration<T_pk, T_sk>
  >(config: T_keyConfiguration): DyDoc_TableBuilderAdditions<{
    gsi: [],
    lsi: [],
    attributes: {
      [k in keyof T_keyConfiguration & string as Uppercase<k>]: T_keyConfiguration[k] extends DyDoc_ColumnConf ? T_keyConfiguration[k] : never
    }
  }>;
};

type DyDoc_TableBuilderAdditions<
  T_table extends DyDoc_TableConfiguration,
> = {
  addGlobalSecondaryIndex<
    T_name extends string,
    T_pk extends DyDoc_ColumnConfForPrimaryKey,
    T_sk extends DyDoc_ColumnConfForPrimaryKey,
    T_keyConfiguration extends DyDoc_PrimaryKeyConfiguration<T_pk, T_sk>
  >(
    name: T_name extends T_table['gsi'][number] ? `GSI '${T_name}' already exists!` : T_name,
    config: T_keyConfiguration
  ): DyDoc_TableBuilderAdditions<{
    gsi: [...T_table['gsi'], T_name],
    lsi: [...T_table['lsi']],
    attributes: T_table['attributes'] & {
      [
        k in keyof T_keyConfiguration & string
        as `GSI_${T_name}_${Uppercase<k>}`
      ]: T_keyConfiguration[k] extends DyDoc_ColumnConf 
        ? T_keyConfiguration[k]
        : never
    }
  }>;
}

declare const tableBuilder: DyDoc_TableBuilder;

const myTable = tableBuilder
  .createTable({ pk: 'RequiredNumber', sk: 'RequiredString' })
  .addGlobalSecondaryIndex('cica', { pk: 'RequiredNumber' })