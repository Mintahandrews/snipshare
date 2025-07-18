import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
  // Define your CSP policy
  const csp = `
    default-src 'self';
    script-src 'self' 'unsafe-inline' 'unsafe-eval' https:;
    style-src 'self' 'unsafe-inline' https:;
    img-src 'self' data: https:;
    font-src 'self' https:;
    connect-src 'self' https:;
    media-src 'self' https:;
    object-src 'none';
    base-uri 'self';
    form-action 'self';
    frame-ancestors 'none';
    block-all-mixed-content;
    upgrade-insecure-requests;
  `.replace(/\s+/g, ' ').trim();

  return (
    <Html lang="en">
      <Head>
        <meta httpEquiv="Content-Security-Policy" content={csp} />
        <meta name="referrer" content="strict-origin" />
        <meta name="x-content-type-options" content="nosniff" />
        <meta name="x-frame-options" content="DENY" />
        <meta name="x-xss-protection" content="1; mode=block" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
