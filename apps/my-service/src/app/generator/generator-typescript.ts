import { Generator } from './generator-types';
import * as C from './config-types';

export const generator: Generator = {

  genItemType: (name, config) => {
    // TODO: PK/SK/TTL type validation

    const getType = (type: C.AttrConfig) => {
      if (type == 'OS' || type == 'RS') return 'string';
      if (type == 'ON' || type == 'RN') return 'number';
      if (type == 'OB' || type == 'RB') return 'boolean';
      throw new Error(`Invalid type '${type}.'`);
    }

    const getOptional = (type: C.AttrConfig) => {
      if (type == 'OS' || type == 'ON' || type == 'OB') return '?';
      if (type == 'RS' || type == 'RN' || type == 'RB') return '';
      throw new Error(`Invalid type '${type}.'`);
    }

    return `
  export interface I${name}TableItem {
    PK${getOptional(config.BASE.PK_T)}: ${getType(config.BASE.PK_T)};
    SK${getOptional(config.BASE.SK_T)}: ${getType(config.BASE.SK_T)};
    ${[1,2,3,4,5]
      .map(i => {
        const c = config[`LSI_${i}`] as C.ILsiSchema;
        if (!c) return '';
        return `LSI_${c.A}_SK${getOptional(c.SK_T)}: ${getType(c.SK_T)};\n`
      }).join('')}
    ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
      .map(i => {
        const c = config[`GSI_${i}`] as C.IGsiSchema;
        if (!c) return '';
        return `GSI_${c.A}_PK${getOptional(c.PK_T)}: ${getType(c.PK_T)};\n  GSI_${c.A}_SK${getOptional(c.SK_T)}: ${getType(c.SK_T)};\n`
      }).join('')}
    ${config.TTL && `TTL${getOptional(config.TTL.T)}: ${getType(config.TTL.T)}` || ''}
  }
    `
  },
  genAttrNameMapper: (name, config) => {
    return `
const aliasToReal = {
  PK: 'P',
  SK: 'S',
  TTL: 'T',
  ${[1,2,3,4,5]
    .map(i => {
      const c = config[`LSI_${i}`] as C.ILsiSchema;
        if (!c) return '';
        return `LSI_${c.A}_SK: 'L${i}';\n`
    }).join('')}
  ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    .map(i => {
      const c = config[`GSI_${i}`] as C.IGsiSchema;
      if (!c) return '';
      return `GSI_${c.A}_PK: 'G${i*2-1}';\n  GSI_${c.A}_SK: 'G${i*2}';\n`
    }).join('')}
};

const realToAlias = {
  P: 'PK',
  S: 'SK',
  T: 'TTL',
  ${[1,2,3,4,5]
    .map(i => {
      const c = config[`LSI_${i}`] as C.ILsiSchema;
        if (!c) return '';
        return `L${i}: 'LSI_${c.A}_SK';\n`
    }).join('')}
  ${[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]
    .map(i => {
      const c = config[`GSI_${i}`] as C.IGsiSchema;
      if (!c) return '';
      return `G${i*2-1}: 'GSI_${c.A}_PK';\n  G${i*2}: 'GSI_${c.A}_SK';\n`
    }).join('')}
};
    `
  }
}