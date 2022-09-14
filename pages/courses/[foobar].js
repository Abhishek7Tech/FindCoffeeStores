import Head from "next/head";
import { useRouter } from "next/router";

function Nextjs(){
    const Router = useRouter();
    return (
        <div>
            <Head>
                {Router.query.foobar}
            </Head>
            <h1>Welcome to next JS! {Router.query.foobar}</h1>
            
        </div>
    )
}

export default Nextjs;