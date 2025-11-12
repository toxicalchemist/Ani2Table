import React from 'react';
import { Link } from 'react-router-dom';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Juan Dela Cruz",
      role: "Founder & CEO",
      image: "https://via.placeholder.com/200",
      description: "Passionate about connecting farmers with consumers to promote sustainable agriculture and fair trade practices."
    },
    {
      name: "Maria Santos",
      role: "Head of Operations",
      image: "https://via.placeholder.com/200",
      description: "Experienced in supply chain management with a focus on agricultural logistics and quality control."
    },
    {
      name: "Pedro Reyes",
      role: "Agricultural Specialist",
      image: "https://via.placeholder.com/200",
      description: "Expert in rice cultivation and farming techniques, providing guidance and support to our farmer partners."
    },
    {
      name: "Ana Garcia",
      role: "Customer Relations",
      image: "https://via.placeholder.com/200",
      description: "Dedicated to ensuring excellent customer experience and building lasting relationships with our community."
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-primary text-white py-20">
        <div className="container mx-auto px-6 text-center">
          <h1 className="text-5xl font-bold mb-4">About Ani2Table</h1>
          <p className="text-xl max-w-3xl mx-auto">
            Bridging the gap between farmers and consumers, bringing fresh agricultural products directly from farm to table.
          </p>
        </div>
      </div>

      {/* Mission Section */}
      <div className="container mx-auto px-6 py-16">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-8 text-primary">Our Mission</h2>
          <p className="text-lg text-gray-700 text-center mb-6">
            Ani2Table is dedicated to empowering Filipino farmers by providing them with a direct platform to sell their products. 
            We believe in fair prices for farmers and quality products for consumers.
          </p>
          <p className="text-lg text-gray-700 text-center">
            Our platform eliminates middlemen, ensuring farmers receive fair compensation while consumers enjoy fresh, 
            high-quality agricultural products at competitive prices.
          </p>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-6">
          <h2 className="text-4xl font-bold text-center mb-4 text-primary">Meet Our Team</h2>
          <p className="text-lg text-gray-600 text-center mb-12 max-w-2xl mx-auto">
            Our dedicated team works tirelessly to support farmers and provide the best service to our customers.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-7xl mx-auto">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-gray-50 rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <div className="aspect-square overflow-hidden bg-gray-200">
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-110 transition-transform duration-300"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/200/8B1A1A/FFFFFF?text=' + member.name.split(' ').map(n => n[0]).join('');
                    }}
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-bold text-gray-900 mb-2">{member.name}</h3>
                  <p className="text-secondary font-semibold mb-3">{member.role}</p>
                  <p className="text-gray-600 text-sm leading-relaxed">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Values Section */}
      <div className="container mx-auto px-6 py-16">
        <h2 className="text-4xl font-bold text-center mb-12 text-primary">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">🌾</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Support Local Farmers</h3>
            <p className="text-gray-600">
              We prioritize the welfare of our farming partners, ensuring fair prices and sustainable practices.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">✨</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Quality Products</h3>
            <p className="text-gray-600">
              Fresh, high-quality agricultural products delivered directly from farm to your table.
            </p>
          </div>
          <div className="text-center p-6">
            <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl text-white">🤝</span>
            </div>
            <h3 className="text-xl font-bold mb-3">Community First</h3>
            <p className="text-gray-600">
              Building a strong community of farmers, consumers, and partners working together.
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-primary-dark text-white py-12">
        <div className="container mx-auto px-6">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div className="col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <img 
                  src="/logo/ani2table-logo.png" 
                  alt="Ani2Table Logo" 
                  className="w-12 h-12 object-contain"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.style.display = 'none';
                    e.target.nextSibling.style.display = 'flex';
                  }}
                />
                <div className="w-12 h-12 bg-gradient-to-br from-secondary to-secondary-light rounded-full items-center justify-center shadow-lg hidden">
                  <span className="text-white font-bold text-xl">A</span>
                </div>
                <span className="font-bold text-2xl">ANI2TABLE</span>
              </div>
              <p className="text-gray-200 leading-relaxed">
                Connecting local rice farmers with consumers for a sustainable and transparent food supply chain.
              </p>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-200">
                <li><Link to="/products" className="hover:text-secondary transition">Products</Link></li>
                <li><Link to="/signup" className="hover:text-secondary transition">Sign Up</Link></li>
                <li><Link to="/login" className="hover:text-secondary transition">Login</Link></li>
                <li><Link to="/about" className="hover:text-secondary transition">About Us</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-bold text-lg mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-200">
                <li>Email: info@ani2table.com</li>
                <li>Phone: +63 912 345 6789</li>
              </ul>
            </div>
          </div>
          <div className="border-t border-primary pt-8 text-center text-gray-200">
            <p>© 2025 Ani2Table. All rights reserved. Bringing local rice to your table.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutPage;
