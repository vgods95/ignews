import { useSession, signIn } from 'next-auth/react';
import { api } from '../../services/api';
import styles from './styles.module.scss';
import { getStripeJs } from '../../services/stripe-js';
import { useRouter } from 'next/router';
interface SubscribeButtonProps {
    priceId: string;
}

export function SubscribeButton({ priceId }: SubscribeButtonProps) {
    const { data: session } = useSession()
    const router = useRouter();
    async function handleSubscribe() {
        if (!session) {
            signIn('github')
            return;
        }

        if (session.activeSubscription) {
            router.push('/posts');
            return;
        }

        //Criação da checkout session
        //3 lugares que podemos usar as credenciais secretas do .env.local
        //getServerSideProps (SSR) essa e a de baixo só são chamadas quando a página é carregada
        //getStaticProps (SSG)
        //API Routes * // o clique virá aqui.
        try {
            const response = await api.post('/subscribe');
            const { sessionId } = response.data;
            const stripe = await getStripeJs();
            await stripe.redirectToCheckout({ sessionId });
        }
        catch (err) {
            console.log(err);
            alert(err.message);
        }
    }

    return (
        <button type="button" className={styles.subscribeButton} onClick={handleSubscribe}>
            Subscribe now
        </button>
    )
}