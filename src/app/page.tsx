import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen">
      <Navbar />

      {/* Hero Section - Updated Layout */}
      <section className="relative min-h-screen flex items-center bg-[#F9F9F9] overflow-hidden">
        <div className="container mx-auto px-6 grid md:grid-cols-2 gap-12 items-center relative z-10 pt-20 pb-10">

          {/* Left Column: Text & CTA */}
          <div className="order-2 md:order-1 text-left space-y-6 animate-in fade-in slide-in-from-left-8 duration-1000">
            <h1 className="font-sans text-5xl md:text-6xl lg:text-7xl font-bold text-[#130E0E] leading-tight tracking-tight">
              Discover Your <br />
              Style Today!
            </h1>

            <p className="text-lg text-[#130E0E]/60 max-w-lg leading-relaxed">
              Experience the pinnacle of nail artistry. Where precision meets luxury, and every detail is designed to make you feel iconic.
            </p>

            <div className="pt-4">
              <Button asChild size="lg" className="rounded-full bg-[#D4AF37] hover:bg-[#C5A028] text-white font-bold px-10 py-6 text-sm tracking-wide shadow-lg hover:shadow-xl transition-all duration-300">
                <Link href="/booking">
                  SHOP NOW
                </Link>
              </Button>
            </div>

            {/* Subtle Brand Watermark */}
            <div className="absolute -left-20 top-1/2 -translate-y-1/2 -rotate-90 opacity-5 hidden lg:block pointer-events-none">
              <span className="text-9xl font-serif text-[#130E0E]">Hazelnailz</span>
            </div>
          </div>

          {/* Right Column: Image */}
          <div className="order-1 md:order-2 relative h-[50vh] md:h-[80vh] w-full animate-in fade-in slide-in-from-right-8 duration-1000 delay-200">
            <div className="absolute inset-0 bg-[#D4AF37]/10 rounded-full blur-3xl transform translate-x-10 translate-y-10 -z-10"></div>
            <img
              src="/images/1773975778727.jpg"
              alt="Model with elegant nails"
              className="w-full h-full object-cover object-top mask-image-fade rounded-3xl"
            />
          </div>
        </div>

        {/* Decorative Elements */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-white via-white/50 to-transparent pointer-events-none"></div>
      </section>

      {/* Philosophy Section - Glass Cards */}
      <section className="py-32 px-6 bg-[#FAF8F8] relative overflow-hidden">
        {/* Background decoration */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-gradient-to-r from-transparent via-[#DFC6C8]/50 to-transparent"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <span className="text-[#CFBDBE] font-semibold tracking-widest uppercase text-sm mb-4 block">Our Philosophy</span>
            <h2 className="font-serif text-5xl md:text-6xl mb-6 text-[#130E0E]">
              Elevating <span className="text-gradient-rose">Nail Artistry</span>
            </h2>
            <p className="text-lg text-[#130E0E]/60 max-w-3xl mx-auto leading-relaxed">
              We believe nails are not just an accessory—they&apos;re a canvas for self-expression.
              Every stroke is deliberate, every shape perfected with precision.
            </p>
          </div>

          {/* Feature Cards - Bento Style */}
          <div className="grid md:grid-cols-3 gap-6">
            {[
              {
                title: "Premium Products",
                description: "Only hypoallergenic, salon-grade products that ensure your nails are as healthy as they are beautiful.",
              },
              {
                title: "Artistry & Precision",
                description: "Each set is crafted with meticulous attention to detail, creating wearable works of art.",
              },
              {
                title: "Luxe Experience",
                description: "From booking to aftercare, enjoy a seamless, premium experience designed around you.",
              },
            ].map((feature, i) => (
              <div
                key={i}
                className="group glass rounded-2xl p-8 hover-lift cursor-pointer"
              >
                <h3 className="font-serif text-2xl font-semibold mb-3 text-[#130E0E]">{feature.title}</h3>
                <p className="text-[#130E0E]/60 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Preview */}
      <section className="py-32 px-6 bg-[#130E0E] relative overflow-hidden">
        {/* Rose accent line */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-[#DFC6C8]/50 to-transparent"></div>

        <div className="container mx-auto max-w-6xl">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <span className="text-[#DFC6C8] font-semibold tracking-widest uppercase text-sm mb-4 block">Services</span>
              <h2 className="font-serif text-5xl md:text-6xl mb-6 text-white">
                Crafted for <span className="text-gradient-rose">Excellence</span>
              </h2>
              <p className="text-lg text-[#B6AFAE] mb-8 leading-relaxed">
                From classic acrylics to intricate nail art, each service is designed to make you feel iconic.
                Book your transformation today.
              </p>

              <div className="space-y-4 mb-10">
                {[
                  "Acrylic Full Sets & Refills",
                  "Gel X & Rubber Base Extensions",
                  "Custom Nail Art & Designs",
                  "Luxury Pedicures",
                ].map((service, i) => (
                  <div key={i} className="flex items-center gap-3 text-[#B6AFAE]">
                    <div className="w-2 h-2 rounded-full bg-[#DFC6C8]"></div>
                    <span>{service}</span>
                  </div>
                ))}
              </div>

              <Button asChild size="lg" className="rounded-full gradient-rose text-[#130E0E] font-semibold px-8 py-6 hover-glow cursor-pointer">
                <Link href="/services" className="flex items-center gap-2">
                  View Full Menu
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </Button>
            </div>

            {/* Image Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-dark">
                  <div className="w-full h-full bg-[url('/images/1773975778751.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-500"></div>
                </div>
                <div className="aspect-square rounded-2xl overflow-hidden glass-dark">
                  <div className="w-full h-full bg-[url('/images/1773975778776.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-500"></div>
                </div>
              </div>
              <div className="space-y-4 pt-8">
                <div className="aspect-square rounded-2xl overflow-hidden glass-dark">
                  <div className="w-full h-full bg-[url('/images/1773975778800.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-500"></div>
                </div>
                <div className="aspect-[3/4] rounded-2xl overflow-hidden glass-dark">
                  <div className="w-full h-full bg-[url('/images/1773975778824.jpg')] bg-cover bg-center hover:scale-105 transition-transform duration-500"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 relative overflow-hidden bg-[#D7C2C2]/30">
        <div className="absolute inset-0 pattern-dots opacity-20"></div>

        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <h2 className="font-serif text-4xl md:text-5xl mb-6 text-[#130E0E]">
            Ready to Feel <span className="text-gradient-rose">Iconic</span>?
          </h2>
          <p className="text-lg text-[#130E0E]/60 mb-10 max-w-2xl mx-auto">
            Secure your appointment with a R100 deposit and treat yourself to the premium nail experience you deserve.
          </p>
          <Button asChild size="lg" className="rounded-full bg-[#130E0E] hover:bg-[#130E0E]/90 text-white font-semibold px-12 py-7 text-lg shadow-2xl shadow-[#130E0E]/30 cursor-pointer group">
            <Link href="/booking" className="flex items-center gap-2">
              Book Now
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </div>
      </section>

      <Footer />
    </main>
  );
}
