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
});
