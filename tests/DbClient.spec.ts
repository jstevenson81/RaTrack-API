import DbClient from '../common/cosmosdb/DbClient';
import { FilterByUserName } from '../common/cosmosdb/predicates';
import { GetAll, GetByUserName } from '../common/cosmosdb/queries';
import { IUser } from '../common/interfaces';

const createUser = async (client: DbClient<IUser>): Promise<IUser> => {
  const newUser: IUser = {
    id: '',
    userName: 'jonathan',
    firstName: 'jonathan',
    lastName: 'stevenson',
    age: '40',
    gender: 'M',
    mobilePhone: '+15044300812'
  };
  await client.addUpdateAsync(newUser);
  return newUser;
};

describe('Ctor Tests', () => {
  it('Constructor should throw if a container is not found', () => {
    expect(() => {
      new DbClient('invalid');
    }).toThrowError(
      'The container passed (invalid) was not found in the config. Please add it to the config file if it exists.'
    );
  });
});

describe('Upsert/Remove tests', () => {
  it('AddUpdateAsync should add a new document', async () => {
    // SETUP
    const client = new DbClient<IUser>('users');
    const newUser: IUser = {
      id: '',
      userName: 'jonathan',
      firstName: 'jonathan',
      lastName: 'stevenson',
      age: '40',
      gender: 'M',
      mobilePhone: '+15044300812'
    };

    // TEST
    const document = await client.addUpdateAsync(newUser);
    expect(document.firstName).toBe('jonathan');

    // CLEANUP
    await client.removeAsync(newUser);
  });

  it('AddUpdateAsync should update a document', async () => {
    // SETUP
    const client = new DbClient<IUser>('users');
    const user = await createUser(client);
    user.userName = 'jstevenson2';
    user.age = '35';
    user.firstName = 'Test';
    user.gender = 'M';
    user.lastName = 'Testee';
    user.mobilePhone = '+15044300812';

    // TEST
    const document = await client.addUpdateAsync(user);
    expect(document.userName).toBe('jstevenson2');

    // CLEANUP
    await client.removeAsync(user);
  });

  it('Remove should remove a document with the corresponding id', async () => {
    const client = new DbClient<IUser>('users');
    const newUser: IUser = {
      id: '',
      userName: 'jonathan',
      firstName: 'jonathan',
      lastName: 'stevenson',
      age: '40',
      gender: 'M',
      mobilePhone: '+15044300812'
    };

    const document = await client.addUpdateAsync(newUser);
    await client.removeAsync(document);

    const deleted = await client.getOneAsync(newUser.id);
    expect(deleted).toBeUndefined();
  });
});

describe('Read Tests', () => {
  it('GetOneAsync should return one record', async () => {
    // SETUP
    const client = new DbClient<IUser>('users');
    const newUser = await createUser(client);

    // TEST
    const result = await client.getOneAsync(newUser.id);
    expect(result).toHaveProperty('id');

    // CLEANUP
    await client.removeAsync(newUser);
  });

  it('GetOneAsync should return undefined when no records match', async () => {
    const client = new DbClient('users');
    const result = await client.getOneAsync('ANANANAN');
    expect(result).toBeUndefined();
  });

  it('GetAllAsync should return a collection of items', async () => {
    // SETUP
    const client = new DbClient<IUser>('users');
    const newUser = await createUser(client);

    // TEST
    const result = await client.getAllAsync();
    expect(result.length).toBeGreaterThan(0);

    // CLEANUP
    await client.removeAsync(newUser);
  });

  it('QueryAsync must have a non-zero length sql statment', async () => {
    const client = new DbClient('users');
    await expect(client.queryAsync(undefined, undefined)).rejects.toThrowError(
      'The parameter sqlQuerySpec cannot be empty'
    );
  });

  it('QueryAsync should return a collection of items.', async () => {
    // SETUP
    const client = new DbClient<IUser>('users');
    const newUser = await createUser(client);

    // TEST
    const result = await client.queryAsync(GetAll());
    expect(result.length).toBeGreaterThan(0);

    // CELANUP
    await client.removeAsync(newUser);
  });

  it('QueryAsync should return an empty collection of items when no items exist in database.', async () => {
    const client = new DbClient('users');
    const result = await client.queryAsync(GetByUserName('blah'), FilterByUserName('blah'));
    expect(result.length).toBe(0);
  });

  it('QueryAsync should return a collection of items with params.', async () => {
    const client = new DbClient('users');
    const result = await client.queryAsync(GetAll());
    expect(result.length).toBeGreaterThan(0);
  });
});
