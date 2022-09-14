import Head from "next/head";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/router";
import styles from "../../styles/coffee-store.module.css";
import cls from "classnames";
import { StoreContext } from "../../store/store-context";
import { isEmpty } from "../../utils";
import { fetchCoffeeStores } from "../../lib/coffee-stores";
import { useCallback, useContext, useEffect, useState } from "react";
import useSWR from "swr";

// Get static Props return a Coffee Store matching the ID //
export async function getStaticProps(staticProps) {
  const params = staticProps.params;
  const coffeeStores = await fetchCoffeeStores();
  const findCoffeeStoresById = coffeeStores.find((coffeeStore) => {
    return coffeeStore.id === params.id; // Dynamic id
  });
  return {
    props: {
      CoffeeStore: findCoffeeStoresById ? findCoffeeStoresById : {},
    },
  };
}

// Static Paths return all possible Paths //
export async function getStaticPaths() {
  const coffeeStores = await fetchCoffeeStores();

  const paths = coffeeStores.map((coffeeStore) => {
    return {
      params: { id: coffeeStore.id?.toString() },
    };
  });
  return {
    // params are passed by getStaticProps
    paths,
    fallback: true,
  };
}

function CoffeeStore(initialProps) {
  const router = useRouter();
  const { state } = useContext(StoreContext);

  const id = router.query.id;
  const { coffeeStores } = state;

  const [coffeeStore, setCoffeeStore] = useState(
    initialProps.CoffeeStore || {}
  );

  const handleCreateCoffeeStore = useCallback(async (coffeeStore) => {
    try {
      const { id, name, address, votes, imgUrl, neighborhood } = coffeeStore;
      const response = await fetch("../api/createCoffeeStore", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id,
          name,
          votes,
          imgUrl,
          address: address || "",
          neighborhood: neighborhood || "",
        }),
      });

      const dbCoffeeStore = await response.json();
    } catch (err) {
      console.error("An error Occured! CreateCoffeeStore", err);
    }
  }, []);

  useEffect(() => {
    if (isEmpty(initialProps.CoffeeStore)) {
      if (coffeeStores.length > 0) {
        const coffeeStoreFromContext = coffeeStores.find((coffeeStore) => {
          return coffeeStore.id === id;
        });
        if (coffeeStoreFromContext) {
          setCoffeeStore(coffeeStoreFromContext);
          handleCreateCoffeeStore(coffeeStoreFromContext);
        }
      }
    } else {
      handleCreateCoffeeStore(initialProps.CoffeeStore);
    }
  }, [id, coffeeStores, initialProps.CoffeeStore, handleCreateCoffeeStore]);

  const [votingCount, setVotingCount] = useState(0);

  const fetcher = (url) => fetch(url).then((res) => res.json());
  const { data, error } = useSWR(`/api/getCoffeeStoreById?id=${id}`, fetcher);

  useEffect(() => {
    
      if (data && data.length > 0) {
        
        setCoffeeStore(data[0]);
        setVotingCount(data[0].votes);
      }
      }, [data]);

 async function  handleUpvoteButton() {

    try {
      const response = await fetch("../api/upVoteCoffeeStoreById", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          id
        }),
      });

      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (err) {
      console.log("An error accored while upvoting!", err);
    }
  }

  if (error) {
    return <div>SOMETHING WENT WRONG WHILE UPVOTING! TRY AGAIN LATER</div>;
  }
  // use if fallback is true in getStaticPaths and data(id) isn't mentioned in the path object Array as a params.
  if (router.isFallback) {
    return <div> Loading... </div>;
  }

  // Destructuring props //
  const { neighborhood, address, name, imgUrl } = coffeeStore;
  return (
    <div>
      <Head>
        <title> {name} </title>
      </Head>
      {/* <h1>Coffee Stores Page</h1> */}
      <div className={styles.container}>
        <div className={styles.col1}>
          <div className={styles.backToHomeLink}>
            <Link href="/">
              <a> Back to Home </a>
            </Link>
          </div>
          <div className={styles.nameWrapper}>
            <h1 className={styles.name}>{name}</h1>
          </div>
          <Image
            src={
              imgUrl ||
              "https://images.unsplash.com/photo-1498804103079-a6351b050096?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=2468&q=80"
            }
            width={500}
            height={300}
            className={styles.storeImg}
            alt={name}
          ></Image>
        </div>

        <div className={cls("glass", styles.col2)}>
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/places.svg"
              width="24"
              height="24"
              alt="places"
            />
            <p className={styles.text}>{address}</p>
          </div>
          {neighborhood && (
            <div className={styles.iconWrapper}>
              <Image
                src="/static/icons/nearMe.svg"
                width="24"
                height="24"
                alt="neighbours"
              />
              <p className={styles.text}>{neighborhood}</p>
            </div>
          )}
          <div className={styles.iconWrapper}>
            <Image
              src="/static/icons/star.svg"
              width="24"
              height="24"
              alt="neighbours"
            />
            <p className={styles.text}>{votingCount}</p>
          </div>

          <button className={styles.upvoteButton} onClick={handleUpvoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
}

export default CoffeeStore;
