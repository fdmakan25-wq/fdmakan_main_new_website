import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollReveal from "@/components/ScrollReveal";

const services = [
  {
    title: "Property Buying",
    description: "Expert guidance through the entire home buying process, from search to closing.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    color: "teal",
    animation: "fade-left" as const,
  },
  {
    title: "Property Selling",
    description: "Maximize your property's value with our professional marketing and negotiation services.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
    ),
    color: "orange",
    animation: "zoom-in" as const,
  },
  {
    title: "Property Rental",
    description: "Find the perfect rental property or list your property for rent with ease.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
    color: "teal",
    animation: "fade-right" as const,
  },
  {
    title: "Property Management",
    description: "Comprehensive property management services for landlords and property owners.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    ),
    color: "orange",
    animation: "fade-left" as const,
  },
  {
    title: "Property Valuation",
    description: "Accurate property valuations to help you make informed real estate decisions.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
      </svg>
    ),
    color: "teal",
    animation: "pop" as const,
  },
  {
    title: "Investment Consulting",
    description: "Expert advice on real estate investment opportunities and portfolio management.",
    icon: (
      <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
      </svg>
    ),
    color: "orange",
    animation: "fade-right" as const,
  }
];

export default function PagesPage() {
  return (
    <main className="min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-teal-500 to-orange-500 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <ScrollReveal animation="fade-down" duration={800}>
              <h1 className="text-5xl md:text-6xl font-bold mb-6 text-white">Our Services</h1>
              <p className="text-xl text-white/90">
                Comprehensive real estate solutions tailored to your needs
              </p>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <ScrollReveal
                key={index}
                animation={service.animation}
                delay={(index % 3) * 120}
                duration={750}
              >
                <div
                  className="bg-white p-8 rounded-xl shadow-lg hover:shadow-2xl hover:-translate-y-1.5 transition-all duration-300 border border-gray-100 group h-full flex flex-col justify-between"
                  style={{ borderTopColor: service.color === 'teal' ? '#14b8a6' : '#f97316', borderTopWidth: '4px' }}
                >
                  <div>
                    <div className={`mb-6 ${service.color === 'teal' ? 'text-teal-500' : 'text-orange-500'} group-hover:scale-110 transition-transform duration-300`}>
                      {service.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-[#1a365d] mb-4 group-hover:text-teal-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="text-gray-600 leading-relaxed mb-4">
                      {service.description}
                    </p>
                  </div>
                  <div>
                    <a
                      href="/contact"
                      className={`inline-flex items-center font-semibold transition ${
                        service.color === 'teal' 
                          ? 'text-teal-500 hover:text-orange-500' 
                          : 'text-orange-500 hover:text-teal-500'
                      }`}
                    >
                      Learn More
                      <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </a>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <ScrollReveal animation="fade-up">
              <h2 className="text-4xl font-bold text-[#1a365d] text-center mb-12">
                Why Choose FD MAKAN?
              </h2>
            </ScrollReveal>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ScrollReveal animation="fade-left" delay={50}>
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a365d] mb-2">Expert Team</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Our experienced professionals bring years of market knowledge and expertise.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={150}>
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a365d] mb-2">Wide Selection</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Access to thousands of properties across various price ranges and locations.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-left" delay={250}>
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 bg-teal-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a365d] mb-2">Personalized Service</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Tailored solutions that match your unique needs and preferences.
                    </p>
                  </div>
                </div>
              </ScrollReveal>

              <ScrollReveal animation="fade-right" delay={350}>
                <div className="flex items-start space-x-4 p-6 bg-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300">
                  <div className="flex-shrink-0 w-14 h-14 bg-orange-500 rounded-full flex items-center justify-center shadow-md">
                    <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-[#1a365d] mb-2">Transparent Process</h3>
                    <p className="text-gray-600 leading-relaxed">
                      Clear communication and honest guidance throughout your real estate journey.
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
