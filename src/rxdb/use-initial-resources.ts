import {useEffect, useState} from 'react';
import {createRxDBReplication, runRxDBReplication} from "./rxdb-replication";

export default function useInitialResources() {
  const [isLoadingComplete, setLoadingComplete] = useState(false);

  // Load any resources or data that we need prior to rendering the app
  useEffect(() => {
    async function run() {
      try {
        await createRxDBReplication();
        await runRxDBReplication();
      } catch (e) {
        // We might want to provide this error information to an error reporting service
        console.error(e);
      } finally {
        setLoadingComplete(true);
      }
    }

    run().then();
  }, []);

  return {isLoadingComplete};
}
