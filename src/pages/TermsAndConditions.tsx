import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Phone, Mail, MessageCircle, Calendar, IndianRupee, Check } from 'lucide-react';

const TermsAndConditions = () => {
  const [language, setLanguage] = useState<'en' | 'ta'>('en');

  const termsContent = {
    en: {
      title: 'Terms & Conditions',
      subtitle: 'Please read our terms and conditions carefully before booking',
      sections: [
        {
          title: 'Advance Booking Payment',
          points: [
            'Advance booking requires ₹10,000 non-refundable booking amount',
            'This amount will be adjusted from the final payment',
            'Payment must be made to secure your preferred date'
          ]
        },
        {
          title: 'Cancellation Policy',
          points: [
            'Cancellation charge of ₹5,000 will be deducted from advance payment',
            'Cancellation must be informed in writing at least 15 days prior',
            'Refund will be processed within 7-10 business days'
          ]
        },
        {
          title: 'Date Changes',
          points: [
            'Date change is allowed based on availability',
            'No additional charges for date changes if made 30 days in advance',
            'Requests within 30 days may incur additional charges based on availability'
          ]
        },
        {
          title: 'Booking Confirmation',
          points: [
            'Your booking is confirmed only after advance payment of ₹10,000',
            'You will receive confirmation via email and WhatsApp',
            'No reservation will be held without advance payment'
          ]
        },
        {
          title: 'Decoration Services',
          points: [
            'Decoration is not included in the hall rental charge',
            'Decoration packages start from ₹20,000',
            'Customized decoration arrangements can be made at additional cost',
            'Our decoration team is available for consultation and arrangements'
          ]
        },
        {
          title: 'Additional Services',
          points: [
            'Sound and LED lighting services are charged separately',
            'Electrical and technical support will incur additional charges',
            'Catering, photography, and DJ services are optional with additional fees',
            'Quotation will be provided separately for each service'
          ]
        },
        {
          title: 'Flex/Tent Setup',
          points: [
            'Flex or tent setup requires NOC (No Objection Certificate) approval from authorities',
            'Management must be informed in advance for flex setup',
            'Additional charges apply for flex installation and removal'
          ]
        },
        {
          title: 'Lift Facility',
          points: [
            'Lift facility is available for guest convenience',
            'Guests must use the lift carefully and responsibly',
            'Management is not responsible for any misuse of lift facility'
          ]
        },
        {
          title: 'Damage & Liability',
          points: [
            'Customers are fully responsible for any damage to the premises or facilities',
            'Damages will be charged at actual cost or replacement cost',
            'Management reserves the right to charge for property damage'
          ]
        },
        {
          title: 'Management Rights',
          points: [
            'Management has full rights to enforce all rules and regulations',
            'Management reserves the right to refuse entry or services if rules are violated',
            'Behavior detrimental to the venue may result in event cancellation',
            'Final authority on all matters rests with the management'
          ]
        }
      ]
    },
    ta: {
      title: 'விதிமுறைகள் மற்றும் நிபந்தனைகள்',
      subtitle: 'முன்பதிவு செய்வதற்கு முன் எங்கள் விதிமுறைகளை கவனமாக படிக்கவும்',
      sections: [
        {
          title: 'முன்பதிவு பணம்',
          points: [
            'முன்பதிவுக்கு ₹10,000 திரும்பக்கொடுக்க முடியாத முன்பணம் அவசியம்',
            'இந்தத் தொகை இறுதிப் பணத்திலிருந்து சரிசெய்யப்படும்',
            'உங்கள் விரும்பிய தேதியை பாதுகாப்பாக வைக்க பணம் செலுத்த வேண்டும்'
          ]
        },
        {
          title: 'ரத்து செய்வதற்கான கொள்கை',
          points: [
            'ரத்து செய்தால் ₹5,000 முன்பணத்திலிருந்து விலக்கு தரப்படும்',
            'ரத்து செய்தல் குறைந்தபட்சம் 15 நாட்களுக்கு முன் எழுதிக் கொடுக்க வேண்டும்',
            'பணம் திரும்ப 7-10 வணிக நாட்களுக்குள் செயல்படுத்தப்படும்'
          ]
        },
        {
          title: 'தேதி மாற்றம்',
          points: [
            'கிடைக்கும் இடத்தை பொருத்து தேதி மாற்றம் அனுமதிக்கப்படுகிறது',
            '30 நாட்களுக்கு முன் செய்த கோரிக்கைக்கு கூடுதல் கட்டணம் இல்லை',
            '30 நாட்களுக்குள் கோரிக்கை மற்றும் கிடைக்கும் இடத்தை பொருத்து கூடுதல் கட்டணம் உண்டு'
          ]
        },
        {
          title: 'முன்பணம் பிறகு உறுதி',
          points: [
            '₹10,000 முன்பணம் செலுத்தினால் மட்டுமே உங்கள் முன்பதிவு உறுதி',
            'மின்னஞ்சல் மற்றும் WhatsApp மூலம் உறுதிக்கு தகவல் கிடைக்கும்',
            'முன்பணம் இல்லாமல் முன்பதிவு வைக்கப்படாது'
          ]
        },
        {
          title: 'அலங்காரம்',
          points: [
            'அலங்காரம் மண்டபத்தின் வாடகையில் சேர்க்கப்படாது',
            'அலங்கரण பொதிகள் ₹20,000 முதல் தொடங்குகிறது',
            'தனிப்பயன் அலங்கரண ஏற்பாடுகள் கூடுதல் செலவுக்கு செய்யப்படுகிறது',
            'எங்கள் அலங்கரணக் குழு ஆலோசனைக்கும் ஏற்பாட்டிற்கும் கிடைக்கிறது'
          ]
        },
        {
          title: 'கூடுதல் சேவைகள்',
          points: [
            'Sound மற்றும் LED விளக்குச் சேவை தனியாக கட்டணம் உண்டு',
            'மின்சாரம் மற்றும் தொழில்நுட்ப ஆதரவு கூடுதல் கட்டணமுண்டு',
            'உணவு, புகைப்படம், DJ சேவை விருப்பமான சேவை கூடுதல் கட்டணம் உண்டு',
            'ஒவ்வொரு சேவைக்கும் தனிக்கு மதிப்பீடு வழங்கப்படும்'
          ]
        },
        {
          title: 'Flex / கூடாரம் அமைத்தல்',
          points: [
            'Flex அல்லது கூடாரம் அமைக்க NOC (நெறை ஆணை) ஆதரவு தேவை',
            'Flex அமைப்பைப் பற்றி முன்கூட்டியே நிர்வாகத்தை தெரிவிக்க வேண்டும்',
            'Flex அமைத்தல் மற்றும் கழற்றுவதற்கு கூடுதல் கட்டணம் உண்டு'
          ]
        },
        {
          title: 'Lift வசதி',
          points: [
            'விருந்தாளிகளின் வசதிக்கு Lift வசதி உள்ளது',
            'Lift-ஐ விரும்பியபடி மற்றும் பொறுப்புடன் பயன்படுத்த வேண்டும்',
            'Lift தவறாக பயன்படுத்தினால் நிர்வாகம் பொறுப்பாக இருக்க மாட்டார்கள்'
          ]
        },
        {
          title: 'சேதம் மற்றும் பொறுப்பு',
          points: [
            'வாடிக்கையாளர் சுவர் அல்லது வசதிக்கு செய்யப்பட்ட சேதத்திற்கு முழுப் பொறுப்புக்கார்',
            'சேதங்கள் உண்மையான செலவு அல்லது பதிலீட்டு செலவுக்கு கட்டணம் உண்டு',
            'சொத்துக்கு சேதம் செய்தால் நிர்வாகம் கட்டணம் வசூல் செய்ய உரிமை உண்டு'
          ]
        },
        {
          title: 'நிர்வாகத்தின் உரிமை',
          points: [
            'நிர்வாகம் அனைத்து விதிமுறைகளையும் அமல்படுத்தும் முழு உரிமை உண்டு',
            'விதிமுறை பிறழ்தினால் நிர்வாகம் நுழைவிற்கு மறுக்க அல்லது சேவை செய்யாமல் இருக்க உரிமை உண்டு',
            'மண்டபத்திற்கு தீங்கு விளைவிக்கும் நடத்தை நிகழ்வு ரத்து செய்யபடலாம்',
            'அனைத்து விடயங்களிலும் சிறுவர் நிர்வாகத்திற்கே இறுதி அதிகாரம் உண்டு'
          ]
        }
      ]
    }
  };

  const current = termsContent[language];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted/20">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-card/95 backdrop-blur-md border-b border-border">
        <div className="container max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <a href="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors">
              <ArrowLeft className="w-5 h-5" />
              <span className="text-sm font-medium">Back</span>
            </a>
            
            {/* Language Toggle */}
            <div className="flex items-center gap-2 bg-muted/50 rounded-full p-1">
              <button
                onClick={() => setLanguage('en')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  language === 'en'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                English
              </button>
              <button
                onClick={() => setLanguage('ta')}
                className={`px-4 py-2 rounded-full font-medium transition-all ${
                  language === 'ta'
                    ? 'bg-primary text-primary-foreground shadow-md'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                தமிழ்
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-4xl mx-auto px-4 py-8 md:py-12">
        {/* Title Section */}
        <div className="text-center mb-12">
          <h1 className="font-display text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-500 to-primary bg-clip-text text-transparent">
            {current.title}
          </h1>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            {current.subtitle}
          </p>
        </div>

        {/* Terms Sections */}
        <div className="space-y-8">
          {current.sections.map((section, idx) => (
            <div
              key={idx}
              className="bg-card rounded-lg border border-border/50 p-6 md:p-8 hover:border-primary/30 transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/10">
                    <span className="text-lg font-bold text-primary">{idx + 1}</span>
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-xl md:text-2xl font-bold text-foreground mb-4">
                    {section.title}
                  </h2>
                  <ul className="space-y-3">
                    {section.points.map((point, pointIdx) => (
                      <li key={pointIdx} className="flex items-start gap-3">
                        <span className="text-primary font-bold mt-1">•</span>
                        <span className="text-muted-foreground text-base leading-relaxed">
                          {point}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Book Now Section */}
        <div className="mt-16 grid md:grid-cols-2 gap-8">
          {/* Left Column - Booking Info */}
          <div className="space-y-6">
            <div>
              <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
                {language === 'en' ? '🎉 Ready to Book?' : '🎉 முன்பதிவு செய்ய தயாரா?'}
              </h2>
              <p className="text-muted-foreground text-lg mb-6 leading-relaxed">
                {language === 'en'
                  ? 'Start your journey to the perfect wedding celebration. Secure your date with just a ₹10,000 advance payment.'
                  : 'உங்கள் சிறந்த திருமண விழாவுக்கு ஆரம்பிக்கவும். ₹10,000 முன்பணம் மூலம் உங்கள் தேதியை பாதுகாப்பாக வைக்கவும்.'}
              </p>
            </div>

            {/* Booking Highlights */}
            <div className="space-y-3">
              <h3 className="font-bold text-foreground">
                {language === 'en' ? 'Booking Benefits:' : 'முன்பதிவு நன்மைகள்:'}
              </h3>
              <div className="space-y-2">
                {[
                  { en: '₹10,000 advance secures your date', ta: '₹10,000 முன்பணம் உங்கள் தேதியை நிலைநிறுத்துகிறது' },
                  { en: 'Amount adjustable from final bill', ta: 'இறுதிப் பில்லிலிருந்து சரிசெய்ய முடியும்' },
                  { en: 'Instant confirmation via WhatsApp & Email', ta: 'WhatsApp மற்றும் மின்னஞ்சல் மூலம் உடனடி உறுதி' },
                  { en: 'Flexible date changes available', ta: 'நமனீய தேதி மாற்றம் கிடைக்கும்' }
                ].map((benefit, idx) => (
                  <div key={idx} className="flex items-start gap-3">
                    <Check className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" />
                    <span className="text-muted-foreground">
                      {language === 'en' ? benefit.en : benefit.ta}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Methods */}
          <div className="space-y-4">
            <h3 className="font-bold text-foreground text-lg mb-4">
              {language === 'en' ? 'Get in Touch:' : 'எங்களை தொடர்பு கொள்ளுங்கள்:'}
            </h3>

            {/* WhatsApp */}
            <a
              href="https://wa.me/919698678450?text=Hi! I'm interested in booking Sikara Mahal for my event."
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-green-500 hover:bg-green-50/5 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                <MessageCircle className="w-6 h-6 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">WhatsApp</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Chat with us instantly' : 'உடனடியாக எங்களை தொடர்பு கொள்ளுங்கள்'}
                </p>
              </div>
            </a>

            {/* Phone Call */}
            <a
              href="tel:9698678450"
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-blue-500 hover:bg-blue-50/5 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                <Phone className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">9698678450</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Call us for details' : 'விவரங்களுக்கு எங்களை அழையுங்கள்'}
                </p>
              </div>
            </a>

            {/* Email */}
            <a
              href="mailto:sikaratechnology@gmail.com"
              className="flex items-center gap-4 p-4 bg-card border border-border rounded-lg hover:border-purple-500 hover:bg-purple-50/5 transition-all group"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-purple-500/10 flex items-center justify-center group-hover:bg-purple-500/20 transition-colors">
                <Mail className="w-6 h-6 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-semibold text-foreground">Email</p>
                <p className="text-sm text-muted-foreground">
                  {language === 'en' ? 'Send us your requirements' : 'உங்கள் தேவைகளை அனுப்பவும்'}
                </p>
              </div>
            </a>

            {/* Book Now Button */}
            <a href="/#booking" className="block pt-4">
              <Button className="w-full bg-gradient-to-r from-primary to-purple-600 hover:from-primary/90 hover:to-purple-600/90 h-12 text-base font-semibold">
                <Calendar className="w-5 h-5 mr-2" />
                {language === 'en' ? 'Start Booking Now' : 'இப்போது முன்பதிவு தொடங்குங்கள்'}
              </Button>
            </a>
          </div>
        </div>

        {/* Payment Info Card */}
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-br from-primary/5 via-purple-500/5 to-pink-500/5 rounded-lg border border-primary/20">
          <div className="grid md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-primary/10 rounded-full">
                  <IndianRupee className="w-6 h-6 text-primary" />
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-1">
                {language === 'en' ? 'Advance Payment' : 'முன்பணம்'}
              </h4>
              <p className="text-2xl font-bold text-primary">₹10,000</p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'Secure your date' : 'தேதியை நிலைநிறுத்தவும்'}
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-purple-500/10 rounded-full">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-1">
                {language === 'en' ? 'Quick Confirmation' : 'விரைவு உறுதி'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? '24 hours' : '24 மணிநேரம்'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'Instant booking confirmation' : 'உடனடி முன்பதிவு உறுதி'}
              </p>
            </div>
            <div>
              <div className="flex justify-center mb-3">
                <div className="p-3 bg-green-500/10 rounded-full">
                  <Check className="w-6 h-6 text-green-600" />
                </div>
              </div>
              <h4 className="font-bold text-foreground mb-1">
                {language === 'en' ? 'Adjustable Amount' : 'சரிசெய்யக்கூடிய தொகை'}
              </h4>
              <p className="text-sm text-muted-foreground">
                {language === 'en' ? 'Final Bill' : 'இறுதி பில்'}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {language === 'en' ? 'No additional charges' : 'கூடுதல் கட்டணம் இல்லை'}
              </p>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-12 p-6 md:p-8 bg-gradient-to-r from-primary/10 to-purple-500/10 rounded-lg border border-primary/20">
          <h3 className="text-xl font-bold text-foreground mb-3">
            {language === 'en' ? '✨ Your Dream Wedding Awaits' : '✨ உங்கள் கனவு திருமணம் காத்திருக்கிறது'}
          </h3>
          <p className="text-muted-foreground mb-6">
            {language === 'en'
              ? 'Contact us today and take the first step towards creating unforgettable wedding memories at Sikara Mahal!'
              : 'Sikara Mahal இல் மறக்க முடியாத திருமண நினைவுகளை உருவாக்குவதற்கான முதல் படி எடுக்க இன்று எங்களை தொடர்பு கொள்ளுங்கள்!'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <a href="/#booking" className="flex-1">
              <Button className="w-full bg-primary hover:bg-primary/90 h-12">
                {language === 'en' ? 'Book Your Date' : 'உங்கள் தேதியை முன்பதிவு செய்யுங்கள்'}
              </Button>
            </a>
            <a href="mailto:sikaratechnology@gmail.com" className="flex-1">
              <Button variant="outline" className="w-full h-12">
                {language === 'en' ? 'Send Inquiry' : 'விசாரணை அனுப்பவும்'}
              </Button>
            </a>
          </div>
        </div>
      </div>

      {/* Footer Links */}
      <div className="mt-12 pt-8 border-t border-border/50">
        <div className="container max-w-4xl mx-auto px-4 pb-12">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
            <p>
              {language === 'en'
                ? '© 2026 Sikara Mahal. All rights reserved.'
                : '© 2026 Sikara Mahal. அனைத்து உரிமைகளும் பாதுகாக்கப்பட்டுள்ளது.'}
            </p>
            <div className="flex gap-6">
              <a href="/" className="hover:text-primary transition-colors">
                {language === 'en' ? 'Home' : 'முகப்பு'}
              </a>
              <a href="/#contact" className="hover:text-primary transition-colors">
                {language === 'en' ? 'Contact' : 'தொடர்பு'}
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditions;
