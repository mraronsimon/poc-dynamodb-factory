export type AttrIsOptional = 'R' | 'O';
export type AttrType = 'S' | 'N' | 'B';
export type AttrConfig = `${AttrIsOptional}${AttrType}`;

export interface ILsiSchema {
  SK_T: AttrConfig;
  A: string;
}

export interface IGsiSchema {
  PK_T: AttrConfig;
  SK_T: AttrConfig;
  A: string;
}

export interface ITableSchema {
  BASE: {
    PK_T: AttrConfig;
    SK_T: AttrConfig;
    // PK_A
    // SK_A
  },
  // Local Secondary Indexes
  LSI_1?: ILsiSchema;
  LSI_2?: ILsiSchema;
  LSI_3?: ILsiSchema;
  LSI_4?: ILsiSchema;
  LSI_5?: ILsiSchema;
  // Global Secondary Indexes
  GSI_1?: IGsiSchema;
  GSI_2?: IGsiSchema;
  GSI_3?: IGsiSchema;
  GSI_4?: IGsiSchema;
  GSI_5?: IGsiSchema;
  GSI_6?: IGsiSchema;
  GSI_7?: IGsiSchema;
  GSI_8?: IGsiSchema;
  GSI_9?: IGsiSchema;
  GSI_10?: IGsiSchema;
  GSI_12?: IGsiSchema;
  GSI_13?: IGsiSchema;
  GSI_14?: IGsiSchema;
  GSI_15?: IGsiSchema;
  GSI_16?: IGsiSchema;
  GSI_17?: IGsiSchema;
  GSI_18?: IGsiSchema;
  GSI_19?: IGsiSchema;
  GSI_20?: IGsiSchema;
  // TTL
  TTL?: { T: AttrConfig }
}

export interface IConfig {
  TableSchemas: { [s: string]: ITableSchema }
}