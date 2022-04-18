import { GetStaticProps } from 'next';
import Head from 'next/head';
import { SubscribeButton } from '../src/components/SubscribeButton';
import { stripe } from '../src/services/stripe';
import styles from './home.module.scss';

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {
  return (
    <>
      <Head>
        <title>Home | ig.news </title>
      </Head>
      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Hey, welcome</span>
          <h1>News about the <span>React</span> world.</h1>
          <p>
            Get access to all the publications <br />
            <span>for {product.amount} month</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/images/avatar.svg" alt="Girl writing" />
      </main>
    </>
  )
}

//Usar sempre esse nome e ela sempre de forma assíncrona mesmo que não tenha await dentro
//Só pode ser usado em páginas e não em components
//export const getServerSideProps: GetServerSideProps = async () => {
export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1KoYHQFuoB0Xh0YAK6o4SIuc', { expand: ['product'] });

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }

  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24, //24 horas (60 segundos * 60 minutos * 24 horas)
  }
}