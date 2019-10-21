import DbClient from '../common/cosmosdb/DbClient';

describe('Read Tests', () => {
  it('GetOneAsync should return one record', async () => {
    const client = new DbClient('users');
    const result = await client.getOneAsync('1');
    expect(result).toHaveProperty('id');
  });

  it('GetOneAsync should return undefined when no records match', async () => {
    const client = new DbClient('users');
    const result = await client.getOneAsync('ANANANAN');
    expect(result).toBeUndefined();
  });

  it('GetAllAsync should return a collection of items', async () => {
    const client = new DbClient('users');
    const result = await client.getAllAsync();
    expect(result.length).toBeGreaterThan(0);
  });

  it('QueryAsync must have a non-zero length sql statment', async () => {
    const client = new DbClient('users');
    await expect(client.queryAsync('', [])).rejects.toThrowError(
      'The parameter sql cannot be empty'
    );
  });

  it('QueryAsync should return a collection of items.', async () => {
    const client = new DbClient('users');
    const result = await client.queryAsync('select * from root r', []);
    expect(result.length).toBeGreaterThan(0);
  });

  it('QueryAsync should return a collection of items with params.', async () => {
    const client = new DbClient('users');
    const result = await client.queryAsync('select * from root r where r.id = @id', [
      { name: '@id', value: '1' }
    ]);
    expect(result.length).toEqual(1);
  });
});
