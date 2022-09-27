import {useEffect, useState} from 'react';
import {createRxDBReplication, runRxDBReplication} from "./rxdb-replication";

export default function useInitialResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  useEffect(() => {
    async function run() {
      try {
        await createRxDBReplication();
        await runRxDBReplication();
      } catch (e) {
        console.error(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    run().then();
  }, []);

  return {isLoadingComplete};
}
