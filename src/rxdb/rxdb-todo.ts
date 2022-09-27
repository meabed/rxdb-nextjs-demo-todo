import {replicateRxCollection, RxReplicationState} from 'rxdb/plugins/replication';
import {rxDBInstance} from "./connection";
import {dbName, retryTimes} from "./common";

export interface RxDBTodo {
  _id: string;
  title: string;
  isCompleted: boolean;
  isNew: boolean;
  createdAt: string;
  updatedAt: string;
  _deleted: boolean;
}

interface RxDBTodoCheckpoint {
  _id: string;
  updatedAt: string;
}

let todoReplication: RxReplicationState<RxDBTodo, RxDBTodoCheckpoint> | undefined;

const replicationIdentifier = `${dbName}-module-todo-api-replication`;

export async function createTodoReplication() {
  if (todoReplication) {
    return todoReplication;
  }
  try {
    if (!rxDBInstance?.collections?.todo) {
      console.log('createTodoReplication: collection not found');
      return;
    }
    todoReplication = replicateRxCollection<RxDBTodo, RxDBTodoCheckpoint>({
      collection: rxDBInstance.collections.todo,
      replicationIdentifier,
      live: true,
      retryTime: retryTimes.todo,
      waitForLeadership: false,
      autoStart: true,
      // pull: {
      //   batchSize: 10,
      //   async handler(lastCheckpoint, batchSize) {
      //     const minTimestamp = lastCheckpoint ? lastCheckpoint.updatedAt : undefined;
      //     const documentsFromRemote = [];
      //     return {
      //       documents: documentsFromRemote,
      //       hasMoreDocuments: documentsFromRemote.length === batchSize,
      //       checkpoint:
      //         documentsFromRemote.length === 0
      //           ? lastCheckpoint
      //           : {
      //             _id: lastOfArray(documentsFromRemote)._id,
      //             updatedAt: lastOfArray(documentsFromRemote).updatedAt,
      //           },
      //     };
      //   },
      // },
      push: {
        batchSize: 1,
        async handler(docs) {
          console.info(`pushing ${docs.length} todo documents to remote`);
          for (const doc of docs) {
            const {_id} = doc.newDocumentState
            console.info(`pushing todo document ${_id} to remote`);
          }
          await new Promise((resolve) => setTimeout(resolve, 5000));
          return [];
        },
      },
    });
  } catch (e) {
    todoReplication = undefined;
    console.error(e);
  }
  return todoReplication;
}

let interval: NodeJS.Timeout | undefined;

export async function runTodoReplication() {
  const rp = await createTodoReplication();
  if (!interval) {
    interval = setInterval(async () => {
      rp?.reSync();
    }, retryTimes.todo);
  }
  return rp;
}

export async function cancelTodoReplication() {
  await todoReplication?.cancel();
  interval && clearInterval(interval);
  interval = undefined;
  todoReplication = undefined;
  return true;
}

export async function destroyTodoReplication() {
  interval && clearInterval(interval);
  interval = undefined;
  await todoReplication?.collection.remove();
  todoReplication = undefined;
  return true;
}
