# PocDynamodbFactory

I want to create a type-safe dynamodb schema builder for Single Table Design.  

## Structure

* In **one table**, we store **multiple document-type**. (semantic unit)
  * e.g.: *User, UserGroup*
* For **one document-type** we store **multiple record-type**. (physical unit)
  * e.g.: *User_Details (node), UserGroup_Details (node), User_UserGroup (edge)*
* One **record-type** contains following columns:
  * **document:**: serialized representation of **document**
  * **document-type**: type of document
  * **document-id**: the owner document of the record *(merge with the prev one?)*
  * **record-type**: type of record
  * **PK**: partition key of primary key *(calculated from document)*
  * **SK**: short key of primary key *(optional, calculated from document)*
  * **indexes**: GSIs, LSIs *(calculated from document)*
  * **TTLs**: *(calculated from document)*

## Statements
  * Content of calculated columns (PK/SK/indexes/TTLs) not means the same thing for all document-type/record-type
    * Column name should be like PK/SK/GSI_n_PK/GSI_n_SK/TTL_m
    * Every record-type must have a mapping function for each calculated column
  * Columns are calculated
    * We don't need to use the same column for many indexes (like SK#GSI_1_PK)

## Build a table
1. Build the **table structure** first
    1. Select **Primary-key**
        * simple: *PK*
        * composite: *PK* + *SK*
    1. Add **GSIs** with name
        * simple: *GSI\_\<name\>\_PK*
        * composite: *GSI_\<name\>\_PK* + *GSI\_\<name\>\_SK*
    1. Add **LSIs** with name
        * *LSI\_\<name\>\_SK*
    1. Add **TTLs** with name
        * *TTL\_\<name\>*
1. Add document-type / record-type
