import type {NextPage} from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import {Todo} from "../src/components/todo";
import useInitialResources from "../src/rxdb/use-initial-resources";

const Home: NextPage = () => {
  const {isLoadingComplete} = useInitialResources();

  if (!isLoadingComplete) {
    return null;
  }


  return (
    <div className={styles.container}>
      <Head>
        <title>TODO ADD</title>
      </Head>
      <Todo/>
    </div>
  )
}

export default Home
