import {cancelTodoReplication, destroyTodoReplication, runTodoReplication} from "./rxdb-todo";
import {initRxDB, rxDBInstance} from "./connection";

export async function createRxDBReplication() {
  console.info('Create RxDBReplication started');
  try {
    await initRxDB();
    console.info('Create RxDBReplication done');
  } catch (error) {
    console.error('Create RxDBReplication error', error);
  }
}

export async function runRxDBReplication() {
  console.info('Run RxDBReplication started');
  try {
    runTodoReplication().catch((error) => console.error('Run Todo Replication error', error));
    console.info('Run RxDBReplication done');
  } catch (error) {
    console.error('Run RxDBReplication error', error);
  }
}

export async function cancelRxDBReplication() {
  console.info('Cancel RxDBReplication started');
  try {
    cancelTodoReplication().catch((error) => console.error('Cancel Todo Replication error', error));
    console.info('Cancel RxDBReplication done');
  } catch (error) {
    console.error('Cancel RxDBReplication error', error);
  }
}

export async function deleteRxDBReplication(params?: { reloadApp?: boolean }) {
  const {reloadApp = true} = params || {};

  try {
    await destroyTodoReplication();
    await rxDBInstance?.remove();
  } catch (error) {
    console.error('deleteRxDB error', error);
  }
  if (reloadApp) {
    window.location.reload();
  }
}
