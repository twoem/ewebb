import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Shield, 
  Lock, 
  Eye, 
  FileText, 
  Users, 
  AlertCircle,
  CheckCircle,
  Mail,
  Phone
} from 'lucide-react';

const DataProtection = () => {
  useEffect(() => {
    document.title = 'Ewebb | Data Protection';
  }, []);

  const protectionMeasures = [
    {
      icon: <Lock className="w-8 h-8" />,
      title: "Encryption",
      description: "All sensitive data is encrypted using industry-standard protocols"
    },
    {
      icon: <Shield className="w-8 h-8" />,
      title: "Secure Storage",
      description: "Documents and personal information stored in secure, access-controlled systems"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "Access Control",
      description: "Strict access controls ensure only authorized personnel handle your data"
    },
    {
      icon: <Eye className="w-8 h-8" />,
      title: "Privacy Protection",
      description: "Your personal information is never shared without your explicit consent"
    }
  ];

  const dataTypes = [
    {
      category: "Personal Information",
      items: [
        "Full names and identification details",
        "Contact information (phone, email, address)",
        "Date of birth and age verification",
        "Passport and ID document copies",
        "Emergency contact information"
      ]
    },
    {
      category: "Service-Related Data",
      items: [
        "Service requests and preferences",
        "Document processing history",
        "Payment and billing information",
        "Communication records",
        "File uploads and downloads"
      ]
    },
    {
      category: "Technical Information",
      items: [
        "IP addresses and device information",
        "Website usage analytics",
        "Browser type and version",
        "Operating system details",
        "Access logs and timestamps"
      ]
    }
  ];

  const userRights = [
    "Access: Request copies of your personal data we hold",
    "Rectification: Request correction of inaccurate information",
    "Erasure: Request deletion of your personal data",
    "Portability: Request transfer of your data to another service",
    "Restriction: Request limitation of data processing",
    "Objection: Object to processing of your personal data"
  ];

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
              Data <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Protection</span>
            </h1>
            <p className="text-xl md:text-2xl text-white/90 max-w-3xl mx-auto">
              Your privacy and data security are our top priorities. 
              Learn how we protect your information and respect your rights.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Protection Measures */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Our <span className="text-gradient">Protection Measures</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement comprehensive security measures to safeguard your personal information
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {protectionMeasures.map((measure, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-6 text-center"
              >
                <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-secondary-500 rounded-full flex items-center justify-center mx-auto mb-4 text-white">
                  {measure.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-3">{measure.title}</h3>
                <p className="text-gray-600">{measure.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Collection */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              What Data We <span className="text-gradient">Collect</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We collect only the information necessary to provide our services effectively
            </p>
          </motion.div>

          <div className="grid lg:grid-cols-3 gap-8">
            {dataTypes.map((dataType, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="card p-8"
              >
                <h3 className="text-2xl font-bold text-gray-800 mb-6">{dataType.category}</h3>
                <ul className="space-y-3">
                  {dataType.items.map((item, itemIndex) => (
                    <li key={itemIndex} className="flex items-start text-gray-600">
                      <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Data Usage */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
            >
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
                How We Use <span className="text-gradient">Your Data</span>
              </h2>
              <div className="space-y-6">
                <div className="flex items-start">
                  <FileText className="w-6 h-6 text-primary-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Service Delivery</h3>
                    <p className="text-gray-600">Processing your requests for eCitizen services, document preparation, and other digital services.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Users className="w-6 h-6 text-primary-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Customer Support</h3>
                    <p className="text-gray-600">Providing assistance, resolving issues, and improving our service quality.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Shield className="w-6 h-6 text-primary-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Legal Compliance</h3>
                    <p className="text-gray-600">Meeting regulatory requirements and protecting against fraud and security threats.</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <AlertCircle className="w-6 h-6 text-primary-500 mr-4 mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">Communication</h3>
                    <p className="text-gray-600">Sending service updates, appointment reminders, and important notifications.</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8 bg-gradient-to-br from-primary-50 to-secondary-50"
            >
              <h3 className="text-2xl font-bold text-gray-800 mb-6">Data Sharing Policy</h3>
              <div className="space-y-4">
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>We never sell your personal information</span>
                </div>
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Data shared only with your consent</span>
                </div>
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Government agencies only when legally required</span>
                </div>
                <div className="flex items-center text-green-700">
                  <CheckCircle className="w-5 h-5 mr-3" />
                  <span>Trusted partners under strict agreements</span>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Your Rights */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mb-6">
              Your <span className="text-gradient">Rights</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              You have control over your personal data. Here are your rights as our customer.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="card p-8"
            >
              <div className="grid md:grid-cols-2 gap-6">
                {userRights.map((right, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                    className="flex items-start"
                  >
                    <CheckCircle className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-700">{right}</span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact for Data Protection */}
      <section className="py-20 bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center text-white"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6">
              Questions About <span className="text-gradient bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Data Protection?</span>
            </h2>
            <p className="text-xl text-gray-300 mb-12 max-w-3xl mx-auto">
              If you have any questions about our data protection practices or want to exercise your rights, 
              please don't hesitate to contact us.
            </p>

            <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
              <motion.a
                href="mailto:ewebbcybercafe@gmail.com"
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center hover:shadow-2xl transition-all duration-300"
              >
                <Mail className="w-12 h-12 text-primary-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Email Us</h3>
                <p className="text-gray-600">ewebbcybercafe@gmail.com</p>
              </motion.a>

              <motion.a
                href="tel:+254700644973"
                whileHover={{ scale: 1.05 }}
                className="card p-6 text-center hover:shadow-2xl transition-all duration-300"
              >
                <Phone className="w-12 h-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-800 mb-2">Call Us</h3>
                <p className="text-gray-600">+254 700 644 973</p>
              </motion.a>
            </div>

            <motion.div
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              className="mt-12 text-center"
            >
              <p className="text-gray-400 text-sm">
                Last updated: {new Date().toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </p>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
};

export default DataProtection;