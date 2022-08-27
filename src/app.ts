import { DynamoDB } from "aws-sdk";
import { Entity, Table } from "dynamodb-toolbox";

(async () => {
    const table = new Table({
      name: 'table',
      partitionKey: 'pk',
      sortKey: 'sk',
      DocumentClient: new DynamoDB.DocumentClient({}),
    });

    const e = new Entity({
      name: 'User',
      attributes: {
        pk: { partitionKey: true },
        sk: { hidden: true, sortKey: true },
        name: { type: 'string', required: true },
        emailVerified: { type: 'boolean', required: true },
      },
      table,
    } as const);

    await e.put({
      pk: 'joe@email.com',
      sk: 'admin',
      name: 'Joe',
      emailVerified: true,
    });

    const { Item: user } = await e.get(
      { pk: 'joe@email.com', sk: 'admin' },
      { attributes: ['name', 'pk'] }
    );

    console.log(user?.name);
})();
