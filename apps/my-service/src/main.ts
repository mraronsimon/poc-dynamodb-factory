import { generator } from './app/generator/generator-typescript'

const itemTypeSTR = generator.genAttrNameMapper('Tenant', {
  BASE: { PK_T: 'RS', SK_T: 'RS' },
  GSI_19: { A: 'Edit', PK_T: 'OS', SK_T: 'RN' },
})

console.log(itemTypeSTR)