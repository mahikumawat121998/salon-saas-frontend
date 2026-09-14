export default function HomePage() {
  return (
    <html>
      <head>
        <meta httpEquiv="refresh" content="0; url=/dashboard" />
      </head>
      <body>
        <script dangerouslySetInnerHTML={{ __html: `window.location.href='/dashboard'` }} />
      </body>
    </html>
  );
}
