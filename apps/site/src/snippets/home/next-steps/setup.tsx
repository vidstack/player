import { VidstackProvider } from '@vidstack/nextjs';

function RootLayout({ children }) {
  return (
    <VidstackProvider>
      <html lang="en">
        <body>{children}</body>
      </html>
    </VidstackProvider>
  );
}
