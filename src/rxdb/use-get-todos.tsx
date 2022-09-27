import {useEffect, useState} from 'react';
import {MangoQuery} from 'rxdb';
import {runTodoReplication} from "./rxdb-todo";
import {Subscription} from "rxjs";

export function useListTodosRxDB(props?: MangoQuery<any>) {
  const [stateDocs, setStateDocs] = useState<any[]>([]);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    let collSub: Subscription | undefined;
    const asyncFunc = async () => {
      const rp = await runTodoReplication();
      collSub = rp?.collection?.find(props ?? {}).$.subscribe((docs) => {
        setStateDocs([...docs.map((e) => e).filter((e) => !e._deleted)]);
      });
      setIsReady(true);
    };
    asyncFunc().then();
    return () => {
      collSub?.unsubscribe();
      setIsReady(false);
    };
  }, [JSON.stringify(props)]);

  return [
    {
      todoList: stateDocs,
      isReady,
    },
  ];
}
