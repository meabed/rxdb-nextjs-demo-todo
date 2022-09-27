import {addRxPlugin, createRxDatabase, RxDatabase} from 'rxdb';
import {RxCollectionCreator} from 'rxdb/dist/types/types/rx-collection';
import {RxDBMigrationPlugin} from 'rxdb/plugins/migration';
import {RxDBQueryBuilderPlugin} from 'rxdb/plugins/query-builder';
import {RxDBUpdatePlugin} from 'rxdb/plugins/update';
import {getRxStorageDexie} from "rxdb/plugins/dexie";
import {dbName} from "./common";

addRxPlugin(RxDBQueryBuilderPlugin);
addRxPlugin(RxDBUpdatePlugin);
addRxPlugin(RxDBMigrationPlugin);

const collectionVersion = 1;
const commonJson: RxCollectionCreator['schema']['properties'] = {
  _id: {
    type: 'string',
    maxLength: 100,
  },
  isNew: {
    type: 'boolean',
    default: false,
  },
  createdAt: {
    type: 'string',
    format: 'date-time',
    maxLength: 24,
  },
  updatedAt: {
    type: 'string',
    format: 'date-time',
    maxLength: 24,
  },
};

export const rxdbCollections: Record<string, RxCollectionCreator> = {
  todo: {
    autoMigrate: true,
    migrationStrategies: {
      1: () => {
      },
    },
    schema: {
      keyCompression: false,
      version: collectionVersion,
      primaryKey: '_id',
      type: 'object',
      properties: {
        ...commonJson,
      },
      required: ['_id', 'data', 'createdAt', 'updatedAt'],
      indexes: ['createdAt', 'updatedAt'],
    },
  }
};

export let rxDBInstance: RxDatabase;

export async function initRxDB(params?: { name?: string }) {
  const {name = dbName} = params || {};
  if (rxDBInstance) {
    return rxDBInstance;
  }
  try {
    rxDBInstance = await createRxDatabase({
      name,
      storage: getRxStorageDexie(),
      localDocuments: true,
      multiInstance: false,
      ignoreDuplicate: true,
    });
    console.info('rxDBInstance created');
    try {
      await rxDBInstance.addCollections(rxdbCollections);
    } catch (error) {
      console.error('error creating collections', error);
    }
    console.info('initRxDB success');
    return rxDBInstance;
  } catch (error) {
    console.error('initRxDB error', error);
  }
}
