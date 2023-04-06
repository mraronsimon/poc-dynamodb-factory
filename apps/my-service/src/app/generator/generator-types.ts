import { ITableSchema } from "./config-types";

type GenerateItemType = (name: string, config: ITableSchema) => string;
type GenerateAttrNameMapper = (name: string, config: ITableSchema) => string;

export interface Generator {
  genItemType: GenerateItemType;
  genAttrNameMapper: GenerateAttrNameMapper;
}
