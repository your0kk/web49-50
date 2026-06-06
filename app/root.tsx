import { Links, Meta, Outlet, Scripts, ScrollRestoration } from "react-router";
import { CartProvider } from "@/hooks/useCart";
import { AuthProvider } from "@/hooks/useAuth";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import "./app.css";

/**
 * The root layout component sets up the HTML skeleton and wraps the
 * application with the CartProvider and AuthProvider so that any
 * component can access the cart and authentication context.  It
 * renders the header and footer on every page and places the
 * currently matched route between them.
 */
export function meta() {
  return [{ title: "Ресторан Вкусно и точка" }];
}

export default function RootLayout() {
  return (
    <html lang="ru">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body className="font-sans antialiased">
        <AuthProvider>
          <CartProvider>
            <div className="min-h-screen flex flex-col">
              <Header />
              <main className="flex-1 container mx-auto px-4 py-6 max-w-4xl">
                <Outlet />
              </main>
              <Footer />
            </div>
          </CartProvider>
        </AuthProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}