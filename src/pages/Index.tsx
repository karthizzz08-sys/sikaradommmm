import Navbar from '@/components/Navbar';
import MobileBottomNav from '@/components/MobileBottomNav';
import AnnouncementBanner from '@/components/AnnouncementBanner';
import HeroSection from '@/components/HeroSection';
import AvailabilityChecker from '@/components/AvailabilityChecker';
import HallBookingSection from '@/components/HallBookingSection';
import PhotographySection from '@/components/PhotographySection';
import DecorationSection from '@/components/DecorationSection';
import SalonSection from '@/components/SalonSection';
import CateringSection from '@/components/CateringSection';
import EventDetailSection from '@/components/EventDetailSection';
import DJSection from '@/components/DJSection';
import GallerySection from '@/components/GallerySection';
import BookingWizard from '@/components/BookingWizard';
import BookingHistory from '@/components/BookingHistory';
import FloatingTotal from '@/components/FloatingTotal';
import GoogleMap from '@/components/GoogleMap';
import Footer from '@/components/Footer';
import FloatingContactWidget from '@/components/FloatingContactWidget';

const Index = () => {
  return (
    <div className="min-h-screen bg-background pb-20 lg:pb-0">
      <AnnouncementBanner />
      <Navbar />
      <MobileBottomNav />
      <HeroSection />
      <AvailabilityChecker />
      <HallBookingSection />
      <PhotographySection />
      <DecorationSection />
      <SalonSection />
      <CateringSection />
      <EventDetailSection />
      <DJSection />
      <GallerySection />
      <BookingWizard />
      <BookingHistory />
      <FloatingTotal />

      <GoogleMap />
      <Footer />
      <FloatingContactWidget />
    </div>
  );
};

export default Index;
