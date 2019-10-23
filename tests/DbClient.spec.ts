import DbClient from '../common/cosmosdb/DbClient';
import { IUser } from '../common/interfaces';


describe('Ctor Tests', () => {
  it('Constructor should throw if a container is not found', () => {
    expect(() => {new DbClient('invalid')}).toThrowError(
      'The container passed (invalid) was not found in the config. Please add it to the config file if it exists.'
    );
  });
})

describe('Upsert/Remove tests', () => {

  it('AddUpdateAsync should add a new document', async () => {
    const client = new DbClient<IUser>('users');
    const newUser: IUser = {
      id: '',
      userName: 'jonathan',
      firstName: 'jonathan',
      lastName: 'stevenson',
      age: '40',
      gender: 'M'
    };

    const document = await client.addUpdateAsync(newUser);
    expect(document.firstName).toBe('jonathan');
  });

  it('Remove should remove a document with the corresponding id', async ()=> {
    const client = new DbClient<IUser>('users');
    const newUser: IUser = {
      id: '',
      userName: 'jonathan',
      firstName: 'jonathan',
      lastName: 'stevenson',
      age: '40',
      gender: 'M'
    };

    const document = await client.addUpdateAsync(newUser);
    await client.removeAsync(document);

    const deleted = await client.getOneAsync(newUser.id);
    expect(deleted).toBeUndefined();
  });

});

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
