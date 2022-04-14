import { AppProps } from 'next/app'
import { Header } from '../src/components/Header';
import '../src/styles/global.scss';

function MyApp({ Component, pageProps } : AppProps) {
  
  return (
    <>
    <Header />
    <Component {...pageProps} />
    </>
  )
}

export default MyApp
