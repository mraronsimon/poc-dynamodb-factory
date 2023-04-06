# DOCS

## TableSchemas

```JSON
{
  "TableSchemas": {
    "ExampleTableSchema": {
      "PrimaryKey": {
        "PK": "RequiredNumber",
        "SK": "RequiredString"
      },
      "LocalSecondaryIndexes": {
        "1": {
          "SK": "OptionalString"
        }
      },
      "GlobalSecondaryIndexes": {
        "1": {
          "PK": "RequiredString",
          "SK": "OptionalString"
        }
      },
      "TimeToLive": true
    }
  }
}
```

```JSON
{
  "TableSchemas": {
    "ExampleTableSchema": {
      "PrimaryKey": {
        // PartitionKey Type: R (Required), O (Optional), N (Number), S (String)
        "PK_T": "RN",
        // SortKey Type
        "SK_T": "RS"
        // PK_A - PartitionKey Alias
        // SK_A - SortKey Alias
      },
      "LSI_1": {
        "SK_T": "OS", // LSI_Example_SK
        // Index Alias
        "I_A": "Example"
      },
      // LSI_2, LSI_3, LSI_4, LSI_5
      "GSI_1": {
        "PK_T": "RequiredString", // GSI_Example_PK
        "SK_T": "OptionalString", // GSI_Example_SK
        "I_A": "Example"
        // PK_A - PartitionKey Alias ??
        // SK_A - SortKey Alias ??
      },
      // GSI_2, ..., GSI_20
      "TTL": {
        "enable": "true"
      }
    }
  }
}
```

STATEMENTS
* you could have multiple named TableSchema
* TableSchema describe the derived attributes
* all derived attribute should have a special role (e.g.: PK, GSI_SK, TTL)

CONSTRAINTS
* cannot modify PK, SK
* cannot modify/create LSI
* create/modify/delete GSI attr types
  * previous existing GSI will be deleted
  * cannot search by that GSI until repopulation (fan-out scan and map)

QUESTIONS
* LSI/GSI mapped attributes?
* LSI/GSI/TTL overlap attributes?

IDEAS
* specify overlap attribute sets
  * [[GSI_1_PK, LSI_SK], [...]]
  * less duplication smaller size
* use attribute aliases query time - use short attribute names low level
  * deterministic mapping? change insensitive?
  * deploy-state file?
  * (GSI_PK and GSI_SK)20*2+(LSI_SK)5+(PK and SK)2+(TTL)1+(DOC_URL or DOC)1 = **50**
* compress data field (GZIP)
* document indexes over multiple table
* GSI supports only eventually consistent read/write.
  * better to manage multiple items as a self managed secondary-index?
* LSI has large overhead because it's store the copies of derived attributes like PK, SK
  * LSI SK SHOULDN'T be unique

* S3 URL as a GSI_PK? S3 generated uuid -> key prefix/suffix? -> GSI_SK, GSI_PK?
  * document-type in the path?