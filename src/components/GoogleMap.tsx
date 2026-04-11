import { MapPin } from 'lucide-react';

const GoogleMap = () => {
  const mapsLink = "https://www.google.com/maps/place/SIKARA+MAHAL/@10.7837147,79.1492118,3a,75y,19.66h,90t/data=!3m7!1e1!3m5!1sTpAhdhCkOnD9yQkBxkfDfw!2e0!6shttps:%2F%2Fstreetviewpixels-pa.googleapis.com%2Fv1%2Fthumbnail%3Fcb_client%3Dmaps_sv.tactile%26w%3D900%26h%3D600%26pitch%3D0%26panoid%3DTpAhdhCkOnD9yQkBxkfDfw%26yaw%3D19.659372!7i16384!8i8192!4m14!1m7!3m6!1s0x3baab9a170ce0a67:0xef059c9376cf42f4!2sSIKARA+MAHAL!8m2!3d10.7837618!4d79.1492248!16s%2Fg%2F11n6rl_x1q!3m5!1s0x3baab9a170ce0a67:0xef059c9376cf42f4!8m2!3d10.7837618!4d79.1492248!16s%2Fg%2F11n6rl_x1q!17m2!4m1!1e3!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDQwOC4wIKXMDSoASAFQAw%3D%3D";

  return (
    <section id="location" className="py-16 px-4 bg-background">
      <div className="container max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="font-display text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent mb-4">
            Visit Us
          </h2>
          <p className="text-muted-foreground text-lg">Find Sikara Mahal on the map</p>
        </div>

        <div className="rounded-lg overflow-hidden shadow-lg border border-border">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3905.123!2d79.1492248!3d10.7837618!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3baab9a170ce0a67:0xef059c9376cf42f4!2sSIKARA%20MAHAL!5e0!3m2!1sen!2sin!4v1712929200000"
            width="100%"
            height="450"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full"
          />
        </div>

        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-4">
          <MapPin className="w-5 h-5 text-primary" />
          <a
            href={mapsLink}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:text-primary/80 font-medium transition-colors"
          >
            Open in Google Maps
          </a>
        </div>
      </div>
    </section>
  );
};

export default GoogleMap;
