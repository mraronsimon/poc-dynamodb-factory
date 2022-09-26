import {
  DyDoc_TableBuilder, DyDoc_TableConfiguration, DyDoc_TableDocumentBuilder
} from './types';

// export declare const TableBuilder: DyDoc_TableBuilder;

declare const documentBuilderFactory: (config: DyDoc_TableConfiguration) => DyDoc_TableDocumentBuilder<DyDoc_TableConfiguration>;
// declare const documentBuilderFactory: <T_TableConfiguration extends DyDoc_TableConfiguration>(config: T_TableConfiguration) => DyDoc_TableDocumentBuilder<T_TableConfiguration>;


export const schemaTableBuilderFactory = (
  documentBuilderFactory: (config: DyDoc_TableConfiguration) => DyDoc_TableDocumentBuilder<DyDoc_TableConfiguration>
): DyDoc_TableBuilder => ({
  createTable: (config) => {
    const configuration: DyDoc_TableConfiguration = {
      attributes: {},
      documents: {},
      gsi: [],
      lsi: []
    }
    configuration.attributes['PK'] = config.pk;
    if (config.sk) {
      configuration.attributes['SK'] = config.sk;
    }
    const builder = {
      addGlobalSecondaryIndex: <T_name extends string>(name: T_name, config) => {
        configuration.gsi = [...configuration.gsi, name];
        configuration.attributes[`GSI_${name}_PK`] = config.pk;
        if (config.sk) {
          configuration.attributes[`GSI_${name}_SK`] = config.sk;
        }
        return builder;
      },
      finalizeTableSchema: () => {
        return documentBuilderFactory(configuration);
      }
    }
    return builder;
  }
});

// export const TableBuilder = schemaTableBuilderFactory(documentBuilderFactory);
