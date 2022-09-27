import styles from "../../styles/Home.module.css";
import {useListTodosRxDB} from "../rxdb/use-get-todos";
import {deleteRxDBReplication} from "../rxdb/rxdb-replication";
import {runTodoReplication} from "../rxdb/rxdb-todo";

export function Todo() {
  const [{todoList, isReady}] = useListTodosRxDB();

  return <main className={styles.main}>
    <h1 className={styles.title}>
      Welcome to <a href="https://rxdb.info/">RxDB!</a>
    </h1>

    <p className={styles.description}>
      Manage your todos with RxDB
    </p>


    <div className={styles.grid}>
      <button onClick={async () => {
        const todoCollection = await runTodoReplication();
        for (let i = 0; i < 10; i++) {
          const todo = await todoCollection?.collection.insert({
            title: `New Todo ${i}` + new Date().getTime() + ' ' + Math.random(),
            isCompleted: false,
            isNew: true,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            _id: new Date().toISOString() + Math.random(),
            _deleted: false,
          });
          console.log(`Created New Todo ${i}`, todo?._id);
        }
      }
      }>
        Add 10 Random Todos
      </button>
    </div>
    <div className={styles.grid}>
      {/*  list todos */}
      {todoList.map(todo => (
        <div key={todo._id}>
          {todo.title}
        </div>
      ))}
    </div>
    <div>
      <button onClick={async () => {
        confirm('Are you sure?') && await deleteRxDBReplication();
      }}>
        Remove RxDB
      </button>
    </div>
  </main>
}
