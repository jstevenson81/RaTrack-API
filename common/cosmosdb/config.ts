import { ICosmosDbConfig } from '../interfaces/index';

const cosmosDbConfig: ICosmosDbConfig = {
  endPoint: 'https://ratrack.documents.azure.com:443/',
  key: 'VjgNqtPvYnrl8qlIyDVWj2AchW0Nml47iwxzuFXT8LOUUWZYWUJjB2FleA9FX4Dw4Vjl3Ut9nqRJ88mttJkbeA==',
  databaseId: 'RaTrack',
  containers: [{ name: 'users' }]
};

export default cosmosDbConfig;
