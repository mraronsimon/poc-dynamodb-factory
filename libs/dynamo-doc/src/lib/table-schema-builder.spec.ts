import { schemaTableBuilderFactory } from './table-schema-builder';

describe('schemaTableBuilderFactory', () => {
  it('Should create PK + SK', (done) => {
    const TableBuilder = schemaTableBuilderFactory((config) => {
      expect(config).toEqual({
        attributes: {
          PK: 'RequiredString',
          SK: 'RequiredNumber'
        },
        documents: {},
        gsi: [],
        lsi: []
      })
      done();

      return {
        addDocumentType: () => { throw new Error('Not implemented') }
      }
    })
    TableBuilder
      .createTable({ pk: 'RequiredString', sk: 'RequiredNumber' })
      .finalizeTableSchema();
  });
  it('Should create PK', (done) => {
    const TableBuilder = schemaTableBuilderFactory((config) => {
      expect(config).toEqual({
        attributes: {
          PK: 'RequiredString'
        },
        documents: {},
        gsi: [],
        lsi: []
      })
      done();

      return {
        addDocumentType: () => { throw new Error('Not implemented') }
      }
    })
    TableBuilder
      .createTable({ pk: 'RequiredString' })
      .finalizeTableSchema();
  });
  it('Should create GSI_example_PK', (done) => {
    const TableBuilder = schemaTableBuilderFactory((config) => {
      expect(config).toEqual({
        attributes: {
          PK: 'RequiredString',
          GSI_example_PK: 'OptionalNumber'
        },
        documents: {},
        gsi: ['example'],
        lsi: []
      })
      done();

      return {
        addDocumentType: () => { throw new Error('Not implemented') }
      }
    })
    TableBuilder
      .createTable({ pk: 'RequiredString' })
      .addGlobalSecondaryIndex('example', { pk: 'OptionalNumber' })
      .finalizeTableSchema();
  });
  it('Should create GSI_example_PK/GSI_example_SK', (done) => {
    const TableBuilder = schemaTableBuilderFactory((config) => {
      expect(config).toEqual({
        attributes: {
          PK: 'RequiredString',
          GSI_example_PK: 'OptionalNumber',
          GSI_example_SK: 'OptionalString'
        },
        documents: {},
        gsi: ['example'],
        lsi: []
      })
      done();

      return {
        addDocumentType: () => { throw new Error('Not implemented') }
      }
    })
    TableBuilder
      .createTable({ pk: 'RequiredString' })
      .addGlobalSecondaryIndex('example', { pk: 'OptionalNumber', sk: 'OptionalString' })
      .finalizeTableSchema();
  });
});
