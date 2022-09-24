import { dynamoDoc } from './dynamo-doc';

describe('dynamoDoc', () => {
  it('should work', () => {
    expect(dynamoDoc()).toEqual('dynamo-doc');
  });
});
