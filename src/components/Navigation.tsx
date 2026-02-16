import { useState, useEffect } from 'react';
import { Menu, X, ShoppingCart, ChevronDown, User, Shield } from 'lucide-react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'motion/react';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { isAdmin } from '../services/adminService';

interface NavigationProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

export function Navigation({ currentPage, onNavigate }: NavigationProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [menuDropdownOpen, setMenuDropdownOpen] = useState(false);
  const { itemCount } = useCart();
  const { currentUser } = useAuth();

  // Debug logging
  useEffect(() => {
    if (currentUser) {
      console.log('👤 Current User:', {
        uid: currentUser.uid,
        email: currentUser.email,
        isAdmin: isAdmin(currentUser.uid)
      });
    } else {
      console.log('👤 No user logged in');
    }
  }, [currentUser]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', page: 'home' },
    { 
      name: 'Menu', 
      page: 'menu',
      submenu: [
        { name: 'Main Menu', page: 'menu' },
        { name: 'Drinks', page: 'drinks' },
        { name: 'Mogodu Monday', page: 'mogodu' },
      ]
    },
    { name: 'Gallery', page: 'gallery' },
    { name: 'Events', page: 'events' },
    { name: 'Bookings', page: 'bookings' },
    { name: 'Contact', page: 'contact' },
  ];

  return (
    <motion.nav
      className={`sticky top-0 z-50 border-b border-[#CBA135]/20 transition-all duration-300 ${
        scrolled ? 'bg-[#121212]/70 backdrop-blur-md' : 'bg-[#121212]/95 backdrop-blur-sm'
      }`}
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <button
            onClick={() => onNavigate('home')}
            className="flex flex-col items-start py-1"
          >
            <span className="smokeville-logo text-[#CBA135] text-base sm:text-lg md:text-xl uppercase">
              SMOKEVILLE
            </span>
            <span className="text-[#F5F5F5]/60 text-[9px] sm:text-[10px] tracking-widest mt-0.5">
              GRILL-PIZZA-BEVES
            </span>
          </button>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <div key={link.page} className="relative">
                {link.submenu ? (
                  <div
                    onMouseEnter={() => setMenuDropdownOpen(true)}
                    onMouseLeave={() => setMenuDropdownOpen(false)}
                  >
                    <motion.button
                      className={`relative transition-colors hover:text-[#CBA135] flex items-center gap-1 ${
                        ['menu', 'drinks', 'mogodu'].includes(currentPage) ? 'text-[#CBA135]' : 'text-[#F5F5F5]'
                      }`}
                      whileHover={{ y: -2 }}
                    >
                      {link.name}
                      <ChevronDown className="w-4 h-4" />
                      {['menu', 'drinks', 'mogodu'].includes(currentPage) && (
                        <motion.div
                          layoutId="underline"
                          className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#CBA135]"
                          initial={false}
                          transition={{ duration: 0.3 }}
                        />
                      )}
                    </motion.button>
                    <AnimatePresence>
                      {menuDropdownOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 10 }}
                          className="absolute top-full left-0 mt-2 w-48 bg-[#1a1a1a] border border-[#CBA135]/20 rounded-lg overflow-hidden shadow-xl z-50"
                        >
                          {link.submenu.map((sublink) => (
                            <button
                              key={sublink.page}
                              onClick={() => {
                                onNavigate(sublink.page);
                                setMenuDropdownOpen(false);
                              }}
                              className={`block w-full text-left px-4 py-3 transition-colors hover:bg-[#CBA135]/20 ${
                                currentPage === sublink.page ? 'bg-[#CBA135]/10 text-[#CBA135]' : 'text-[#F5F5F5]'
                              }`}
                            >
                              {sublink.name}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                ) : (
                  <motion.button
                    onClick={() => onNavigate(link.page)}
                    className={`relative transition-colors hover:text-[#CBA135] ${
                      currentPage === link.page ? 'text-[#CBA135]' : 'text-[#F5F5F5]'
                    }`}
                    whileHover={{ y: -2 }}
                  >
                    {link.name}
                    {currentPage === link.page && (
                      <motion.div
                        layoutId="underline"
                        className="absolute -bottom-1 left-0 right-0 h-0.5 bg-[#CBA135]"
                        initial={false}
                        transition={{ duration: 0.3 }}
                      />
                    )}
                  </motion.button>
                )}
              </div>
            ))}
          </div>

          {/* Right Side - Cart & Login */}
          <div className="hidden md:flex items-center space-x-4">
            <button
              onClick={() => onNavigate('order')}
              className="relative p-2 hover:text-[#CBA135] transition-colors"
            >
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-[#CBA135] text-[#121212] rounded-full w-5 h-5 flex items-center justify-center text-xs font-semibold">
                  {itemCount}
                </span>
              )}
            </button>
            {currentUser ? (
              <>
                {/* Admin Dashboard Button - Only visible for admins */}
                {isAdmin(currentUser.uid) && (
                  <button
                    onClick={() => onNavigate('admin')}
                    className="flex items-center gap-2 p-2 hover:text-[#CBA135] transition-colors"
                    title="Admin Dashboard"
                  >
                    <Shield className="w-5 h-5" />
                    <span className="hidden lg:inline text-sm">Admin</span>
                  </button>
                )}
                <button
                  onClick={() => onNavigate('profile')}
                  className="flex items-center gap-2 p-2 hover:text-[#CBA135] transition-colors"
                >
                  <User className="w-5 h-5" />
                  <span className="hidden lg:inline text-sm">Profile</span>
                </button>
              </>
            ) : (
              <Button
                onClick={() => onNavigate('login')}
                className="bg-gradient-to-r from-[#CBA135] to-[#B36A2E] hover:from-[#B36A2E] hover:to-[#CBA135] text-[#121212]"
              >
                Login
              </Button>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-[#F5F5F5]"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-[#1a1a1a] border-t border-[#CBA135]/20 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-3">
              {navLinks.map((link, index) => (
                <div key={link.page}>
                  {link.submenu ? (
                    <div className="space-y-2">
                      <div className="text-[#CBA135] py-2">{link.name}</div>
                      {link.submenu.map((sublink, subIndex) => (
                        <motion.button
                          key={sublink.page}
                          initial={{ x: -20, opacity: 0 }}
                          animate={{ x: 0, opacity: 1 }}
                          transition={{ delay: (index + subIndex) * 0.05 }}
                          onClick={() => {
                            onNavigate(sublink.page);
                            setMobileMenuOpen(false);
                          }}
                          className={`block w-full text-left py-2 pl-4 transition-colors ${
                            currentPage === sublink.page ? 'text-[#CBA135]' : 'text-[#F5F5F5]'
                          }`}
                        >
                          {sublink.name}
                        </motion.button>
                      ))}
                    </div>
                  ) : (
                    <motion.button
                      initial={{ x: -20, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => {
                        onNavigate(link.page);
                        setMobileMenuOpen(false);
                      }}
                      className={`block w-full text-left py-2 transition-colors ${
                        currentPage === link.page ? 'text-[#CBA135]' : 'text-[#F5F5F5]'
                      }`}
                    >
                      {link.name}
                    </motion.button>
                  )}
                </div>
              ))}
              <div className="pt-4 border-t border-[#CBA135]/20 space-y-3">
                <button
                  onClick={() => {
                    onNavigate('order');
                    setMobileMenuOpen(false);
                  }}
                  className="flex items-center space-x-2 text-[#F5F5F5]"
                >
                  <ShoppingCart className="w-5 h-5" />
                  <span>Cart ({itemCount})</span>
                </button>
                {currentUser ? (
                  <>
                    {/* Admin button for mobile - only visible for admins */}
                    {isAdmin(currentUser.uid) && (
                      <button
                        onClick={() => {
                          onNavigate('admin');
                          setMobileMenuOpen(false);
                        }}
                        className="flex items-center space-x-2 text-[#F5F5F5] w-full py-2"
                      >
                        <Shield className="w-5 h-5" />
                        <span>Admin Dashboard</span>
                      </button>
                    )}
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setMobileMenuOpen(false);
                      }}
                      className="flex items-center space-x-2 text-[#F5F5F5] w-full py-2"
                    >
                      <User className="w-5 h-5" />
                      <span>Profile</span>
                    </button>
                  </>
                ) : (
                  <Button
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full bg-gradient-to-r from-[#CBA135] to-[#B36A2E] text-[#121212]"
                  >
                    Login
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
