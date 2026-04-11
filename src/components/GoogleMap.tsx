import { MapPin } from 'lucide-react';

const GoogleMap = () => {
  const mapsLink = "https://maps.app.goo.gl/ttyArqidAoVCNsdy5";

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
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3671.5!2d72.5!3d23.07!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1sSikara%20Mahal!2s!5e0!3m2!1sen!2sin!4v1712800000000&q=Sikara+Mahal+Ahmedabad"
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
