import Image from 'next/image';

export default function AboutSection() {
  return (
    <section className="py-14 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Side - Images */}
          <div className="relative">
            {/* Decorative Dots */}
            <div className="absolute -top-4 -left-4 z-0">
              <div className="flex flex-col gap-2">
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-brand-teal rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-brand-teal rounded-full opacity-60"></div>
                  <div className="w-2 h-2 bg-brand-teal rounded-full opacity-60"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-brand-teal rounded-full opacity-60"></div>
                </div>
                <div className="flex gap-2">
                  <div className="w-2 h-2 bg-brand-teal rounded-full opacity-60"></div>
                </div>
              </div>
            </div>

            {/* Main Image Container */}
            <div className="relative rounded-2xl overflow-hidden shadow-2xl z-10">
              {/* Main Image */}
              <div className="relative w-full h-[500px] rounded-2xl overflow-hidden">
                <Image
                  src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  alt="Modern Real Estate Property"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Content */}
          <div className="space-y-6">
            {/* About Us Label */}
            <div className="inline-flex items-center gap-2">
              <span className="type-section-label">About Our Company</span>
            </div>

            <h2 className="type-display-sm max-w-xl">
              The Leading Real Estate Rental Marketplace<span className="text-accent-orange">.</span>
            </h2>

            <p className="type-body max-w-xl">
              Over 39,000 people work for us in more than 70 countries all over the world. This breadth of global coverage, combined with specialist services
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-6 py-6">
              {/* Feature 1 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Smart Home Design</h3>
                </div>
              </div>

              {/* Feature 2 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Beautiful Scene Around</h3>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Exceptional Lifestyle</h3>
                </div>
              </div>

              {/* Feature 4 */}
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-brand-teal/10 rounded-lg flex items-center justify-center">
                  <svg className="w-6 h-6 text-brand-teal" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Complete 24/7 Security</h3>
                </div>
              </div>
            </div>

            {/* Quote/Testimonial Box */}
            <div className="bg-brand-red/10 rounded-xl p-6 border-l-4 border-brand-red">
              <p className="text-gray-700 italic leading-relaxed">
                "Enimad minim veniam quis nostrud exercitation llamco laboris. Lorem ipsum dolor sit amet"
              </p>
            </div>

            {/* CTA Button */}
            <div className="pt-4">
              <button className="bg-gradient-to-r from-brand-red to-brand-red-dark hover:from-brand-red-dark hover:to-brand-red text-white font-semibold px-8 py-4 rounded-lg transition shadow-lg uppercase tracking-wide">
                Our Services
              </button>
            </div>
          </div>
        </div>

        {/* Excellence Cards Section */}
        <div className="mt-24">
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-2 bg-brand-red/10 rounded-full mb-6">
              <span className="text-brand-red font-semibold text-sm uppercase tracking-widest">Why Choose Us</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight">
              Excellence in Every <span className="gradient-text">Transaction</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto leading-relaxed">
              Experience the difference of working with a team that truly understands real estate
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-10 rounded-2xl shadow-custom-medium border border-lightGray hover:shadow-custom-heavy transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Trusted & Reliable</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Years of experience in the real estate market with a proven track record of successful transactions and satisfied clients.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-custom-medium border border-lightGray hover:shadow-custom-heavy transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fast & Efficient</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Streamlined processes that help you find or sell your property quickly without compromising on quality or service.
              </p>
            </div>
            
            <div className="bg-white p-10 rounded-2xl shadow-custom-medium border border-lightGray hover:shadow-custom-heavy transition-all duration-300 transform hover:-translate-y-2 group">
              <div className="w-20 h-20 bg-gradient-to-br from-brand-red to-brand-red-dark rounded-2xl flex items-center justify-center mb-8 shadow-lg group-hover:scale-110 transition-transform duration-300">
                <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Expert Team</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                Our professional agents are dedicated to providing personalized service tailored specifically to your unique needs.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

