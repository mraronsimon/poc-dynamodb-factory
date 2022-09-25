import { userSerializer } from './documents/user';
import { userGroupSerializer } from './documents/user-group';
import { tableSchema } from './table-schema';

const tableConfiguration = tableSchema
  .addDocumentType(userSerializer)
  .addDocumentType(userGroupSerializer)

// TODO: getDynamoDB config -> CreateTableCommandInput
// TODO: getModel (getters, setters)
// TODO: createFromDump?
// TODO: serveVisualEditor