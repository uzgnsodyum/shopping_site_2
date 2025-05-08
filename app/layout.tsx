"use client";
import "bootstrap/dist/css/bootstrap.min.css";
import Navigation from "./components/Navigation";
import { CartProvider } from "./context/CartContext";


export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <CartProvider>
          <Navigation />
          <main className="container py-4">{children}</main>
          <footer className="bg-dark text-white text-center py-3 mt-5">
            <div className="container">
              <p className="mb-0">© 2025 E-Commerce Shop. All rights reserved.</p>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}