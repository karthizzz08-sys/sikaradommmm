import './AnnouncementBanner.css';

const AnnouncementBanner = () => {
  return (
    <div className="announcement-banner bg-gradient-to-r from-yellow-400 via-purple-500 to-pink-500 py-3 sm:py-4 overflow-hidden sticky top-0 z-50 shadow-lg border-b-2 border-yellow-300">
      <div className="marquee-container">
        <div className="marquee-content font-bold text-white text-sm sm:text-base md:text-lg tracking-wide">
          
          {/* 🔥 Duplicate content */}
          <span className="marquee-text">
            🎉 Bookings above ₹3,00,000 get 10% discount on total amount — Hall Rent FREE 🎉 ·
          </span>

          <span className="marquee-text">
            🎉 Bookings above ₹3,00,000 get 10% discount on total amount — Hall Rent FREE 🎉 ·
          </span>

        </div>
      </div>
    </div>
  );
};

export default AnnouncementBanner;