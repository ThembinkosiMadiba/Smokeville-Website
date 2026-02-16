import { useState } from 'react';
import { Navigation } from './components/Navigation';
import { Footer } from './components/Footer';
import { BackToTop } from './components/BackToTop';
import { AdminDebug } from './components/AdminDebug';
import { MagneticCursor } from './components/MagneticCursor';
import { HomePage } from './components/pages/HomePage';
import { MenuPage } from './components/pages/MenuPage';
import { DrinksPage } from './components/pages/DrinksPage';
import { MogoduMondayPage } from './components/pages/MogoduMondayPage';
import { AboutPage } from './components/pages/AboutPage';
import { EventsPage } from './components/pages/EventsPage';
import { BookingsPage } from './components/pages/BookingsPage';
import { OrderPage } from './components/pages/OrderPage';
import { ContactPage } from './components/pages/ContactPage';
import { CareersPage } from './components/pages/CareersPage';
import { LoginPage } from './components/pages/LoginPage';
import { SignUpPage } from './components/pages/SignUpPage';
import { ProfilePage } from './components/pages/ProfilePage';
import { GalleryPage } from './components/pages/GalleryPage';
import { AdminPage } from './components/pages/AdminPage';
import { CartProvider } from './contexts/CartContext';
import { AuthProvider } from './contexts/AuthContext';
import { Toaster } from './components/ui/sonner';

type Page =
  | 'home'
  | 'menu'
  | 'drinks'
  | 'mogodu'
  | 'about'
  | 'events'
  | 'bookings'
  | 'order'
  | 'contact'
  | 'careers'
  | 'login'
  | 'signup'
  | 'profile'
  | 'gallery'
  | 'admin';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');

  const handleNavigate = (page: string) => {
    setCurrentPage(page as Page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;
      case 'menu':
        return <MenuPage onNavigate={handleNavigate} />;
      case 'drinks':
        return <DrinksPage />;
      case 'mogodu':
        return <MogoduMondayPage />;
      case 'about':
        return <AboutPage />;
      case 'events':
        return <EventsPage onNavigate={handleNavigate} />;
      case 'bookings':
        return <BookingsPage />;
      case 'order':
        return <OrderPage onNavigate={handleNavigate} />;
      case 'contact':
        return <ContactPage />;
      case 'careers':
        return <CareersPage />;
      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;
      case 'signup':
        return <SignUpPage onNavigate={handleNavigate} />;
      case 'profile':
        return <ProfilePage onNavigate={handleNavigate} />;
      case 'gallery':
        return <GalleryPage />;
      case 'admin':
        return <AdminPage onNavigate={handleNavigate} />;
      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  // Don't show navigation and footer on login/signup pages
  const showLayout = currentPage !== 'login' && currentPage !== 'signup';

  return (
    <AuthProvider>
      <CartProvider>
        <div className="min-h-screen bg-[#121212] text-[#F5F5F5]">
          {showLayout && (
            <Navigation currentPage={currentPage} onNavigate={handleNavigate} />
          )}
          <main>{renderPage()}</main>
          {showLayout && (
            <>
              <Footer onNavigate={handleNavigate} />
              <BackToTop />
            </>
          )}
          <Toaster />
          <MagneticCursor />
          {/* Temporary Debug Panel - Remove after troubleshooting */}
         
        </div>
      </CartProvider>
    </AuthProvider>
  );
}
