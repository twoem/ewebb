import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Smartphone, 
  FileText, 
  Printer, 
  Globe, 
  Download,
  CreditCard,
  Users,
  Clock,
  Shield,
  CheckCircle,
  ExternalLink
} from 'lucide-react';

const Services = () => {
  useEffect(() => {
    document.title = 'Ewebb | Services';
  }, []);

  const whatsappNumber = '254700644973';
  
  const serviceCategories = [
    {
      title: "eCitizen Services",
      icon: <Smartphone className="w-8 h-8" />,
      description: "Complete government digital services assistance",
      image: "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      services: [
        "Birth Certificate Applications",
        "Death Certificate Processing",
        "Marriage Certificate Services",
        "Passport Applications",
        "National ID Applications",
        "Driving License Services",
        "Business Registration",
        "Tax Compliance (iTax)",
        "NHIF Registration",
        "NSSF Services"
      ]
    },
    {
      title: "Document Services",
      icon: <FileText className="w-8 h-8" />,
      description: "Professional document processing and management",
      image: "https://images.unsplash.com/photo-1554224155-8d04cb21cd6c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      services: [
        "Document Typing",
        "CV/Resume Writing",
        "Academic Transcripts",
        "Business Proposals",
        "Legal Documents",
        "Application Forms",
        "Document Translation",
        "Proofreading Services",
        "Document Formatting",
        "Letterhead Design"
      ]
    },
    {
      title: "Printing & Copying",
      icon: <Printer className="w-8 h-8" />,
      description: "High-quality printing and photocopying services",
      image: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      services: [
        "Black & White Printing",
        "Color Printing",
        "Large Format Printing",
        "Photocopying",
        "Document Scanning",
        "Lamination Services",
        "Binding Services",
        "Business Cards",
        "Flyers & Brochures",
        "Banners & Posters"
      ]
    },
    {
      title: "Internet & Digital",
      icon: <Globe className="w-8 h-8" />,
      description: "Internet access and digital services",
      image: "https://images.unsplash.com/photo-1432888622747-4eb9a8efeb07?ixlib=rb-4.0.3&auto=format&fit=crop&w=2340&q=80",
      services: [
        "High-Speed Internet",
        "Email Services",
        "Social Media Management",
        "Online Research",
        "File Downloads",
        "Cloud Storage Setup",
        "Video Conferencing",
        "Online Banking Assistance",
        "E-commerce Support",
        "Digital Literacy Training"
      ]
    }
  ];

  const handleGetService = (serviceName) => {
    const message = `Hello, I need help with ${serviceName}. Please provide more information about this service.`;
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary-600 via-secondary-600 to-accent-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Our <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Services</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Comprehensive digital solutions for all your business and personal needs. 
              Professional, reliable, and affordable services.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { icon: <Clock className="w-8 h-8" />, title: "Fast Service", desc: "Quick turnaround times" },
              { icon: <Shield className="w-8 h-8" />, title: "Secure", desc: "Your data is protected" },
              { icon: <Users className="w-8 h-8" />, title: "Expert Team", desc: "Professional assistance" },
              { icon: <CreditCard className="w-8 h-8" />, title: "Affordable", desc: "Competitive pricing" }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                <p className="text-gray-600">{feature.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Categories */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Service <span className="text-gradient">Categories</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Explore our comprehensive range of digital services designed to meet all your needs
            </p>
          </motion.div>

          <div className="space-y-16">
            {serviceCategories.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: categoryIndex * 0.1 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className={`grid lg:grid-cols-2 gap-0 ${categoryIndex % 2 === 1 ? 'lg:grid-flow-col-dense' : ''}`}>
                  {/* Image */}
                  <div className={`relative h-64 lg:h-auto ${categoryIndex % 2 === 1 ? 'lg:col-start-2' : ''}`}>
                    <img
                      src={category.image}
                      alt={category.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div>
                  </div>

                  {/* Content */}
                  <div className="p-8 lg:p-12">
                    <div className="flex items-center mb-6">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-lg flex items-center justify-center mr-4 text-white">
                        {category.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl lg:text-3xl font-bold text-gray-800">{category.title}</h3>
                        <p className="text-gray-600 mt-1">{category.description}</p>
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-3 mb-8">
                      {category.services.map((service, serviceIndex) => (
                        <motion.div
                          key={serviceIndex}
                          initial={{ opacity: 0, x: -20 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: serviceIndex * 0.05 }}
                          className="flex items-center text-gray-700 hover:text-primary-600 transition-colors cursor-pointer group"
                          onClick={() => handleGetService(service)}
                        >
                          <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                          <span className="group-hover:underline">{service}</span>
                        </motion.div>
                      ))}
                    </div>

                    <button
                      onClick={() => handleGetService(category.title)}
                      className="btn-primary inline-flex items-center"
                    >
                      Get {category.title}
                      <ExternalLink className="ml-2 w-5 h-5" />
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Ready to Get <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Started?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Contact us today to discuss your requirements and get a personalized quote for our services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                onClick={() => handleGetService('General Service Inquiry')}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="btn-accent inline-flex items-center"
              >
                Contact Us Now
                <ExternalLink className="ml-2 w-5 h-5" />
              </motion.button>
              <motion.a
                href="tel:+254700644973"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-white/20 backdrop-blur-sm text-white font-semibold py-3 px-6 rounded-lg border border-white/30 hover:bg-white/30 transition-all duration-300 flex items-center justify-center"
              >
                Call +254 700 644 973
              </motion.a>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default Services;