import 'bootstrap/dist/css/bootstrap.min.css';
import { useEffect } from 'react';
import Layout from '../components/Layout';

function MyApp({ Component, pageProps }) {
  // Fix for bootstrap scripts in Next.js
  useEffect(() => {
    import('bootstrap/dist/js/bootstrap');
  }, []);

  return (
    <Layout>
      <Component {...pageProps} />
    </Layout>
  );
}

export default MyApp;