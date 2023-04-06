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
        "PK": "RequiredNumber",
        "SK": "RequiredString"
      },
      "LSI_1": {
        "SK": "OptionalString", // LSI_Example_SK
        "alias": "Example"
      },
      // LSI_2, LSI_3, LSI_4, LSI_5
      "GSI_1": {
        "PK": "RequiredString", // GSI_Example_PK
        "SK": "OptionalString", // GSI_Example_SK
        "alias": "Example"
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
* create/modify GSI attr types
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
* compress data field
