import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { 
  Scissors, Star, Clock, MapPin, Phone, Mail, 
  Instagram, Facebook, Award, Users, Calendar,
  Sparkles, Heart, Palette, Crown, ArrowRight,
  CheckCircle, Play, ChevronLeft, ChevronRight
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const services = [
    {
      icon: Scissors,
      name: "Hair Styling & Cuts",
      description: "Professional cuts, styling, and treatments by expert stylists",
      price: "From ₹1,500",
      popular: true
    },
    {
      icon: Sparkles,
      name: "Hair Coloring",
      description: "Premium coloring, highlights, and color correction services",
      price: "From ₹2,800",
      popular: false
    },
    {
      icon: Crown,
      name: "Bridal Services",
      description: "Complete bridal packages for your special day",
      price: "From ₹5,000",
      popular: true
    },
    {
      icon: Palette,
      name: "Makeup Services",
      description: "Professional makeup for all occasions",
      price: "From ₹2,200",
      popular: false
    },
    {
      icon: Heart,
      name: "Spa Treatments",
      description: "Relaxing facials, massages, and wellness treatments",
      price: "From ₹2,500",
      popular: false
    },
    {
      icon: Star,
      name: "Premium Packages",
      description: "Complete makeover packages with multiple services",
      price: "From ₹6,500",
      popular: true
    }
  ];

  const testimonials = [
    {
      name: "Sarah Johnson",
      text: "Absolutely amazing experience! The stylists are so talented and the salon atmosphere is so relaxing. I've been coming here for 2 years and never disappointed.",
      rating: 5,
      service: "Hair Styling"
    },
    {
      name: "Emily Chen",
      text: "Best bridal services in the city! They made me feel like a princess on my wedding day. The attention to detail was incredible.",
      rating: 5,
      service: "Bridal Package"
    },
    {
      name: "Maria Rodriguez",
      text: "The color correction they did on my hair was miraculous. I thought my hair was ruined, but they made it look even better than before!",
      rating: 5,
      service: "Hair Coloring"
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: "Easy Online Booking",
      description: "Book your appointments 24/7 through our convenient online system"
    },
    {
      icon: Users,
      title: "Expert Stylists",
      description: "Our team of certified professionals with years of experience"
    },
    {
      icon: Award,
      title: "Award Winning",
      description: "Recognized as the Best Salon in the city for 3 consecutive years"
    },
    {
      icon: Sparkles,
      title: "Premium Products",
      description: "We use only the finest, eco-friendly, and cruelty-free products"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Scissors className="h-6 w-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Luxe Beauty Lounge
                </h1>
                <p className="text-xs text-gray-500">Premium Salon & Spa</p>
              </div>
            </div>
            
            <div className="hidden md:flex items-center space-x-8">
              <a href="#services" className="text-gray-700 hover:text-pink-600 transition-colors">Services</a>
              <a href="#about" className="text-gray-700 hover:text-pink-600 transition-colors">About</a>
              <a href="#testimonials" className="text-gray-700 hover:text-pink-600 transition-colors">Reviews</a>
              <a href="#contact" className="text-gray-700 hover:text-pink-600 transition-colors">Contact</a>
              <Button 
                onClick={() => navigate('/login')}
                className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700"
              >
                Staff Login
              </Button>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 py-20 lg:py-32 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-pink-100 text-pink-700 border-pink-200">
                  ✨ Award Winning Salon
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                  Where Beauty
                  <span className="bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent"> Meets </span>
                  Excellence
                </h1>
                <p className="text-xl text-gray-600 leading-relaxed">
                  Experience luxury and style at Luxe Beauty Lounge. Our expert stylists create stunning looks 
                  that enhance your natural beauty and boost your confidence.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  size="lg"
                  className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
                  onClick={() => window.open('tel:+918012345678')}
                >
                  <Phone className="mr-2 h-5 w-5" />
                  Book Appointment
                </Button>
                <Button 
                  variant="outline" 
                  size="lg"
                  className="border-pink-300 text-pink-600 hover:bg-pink-50 px-8 py-3"
                  onClick={() => document.getElementById('services').scrollIntoView({ behavior: 'smooth' })}
                >
                  <Play className="mr-2 h-4 w-4" />
                  View Services
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-6 pt-8">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">500+</div>
                  <div className="text-sm text-gray-600">Happy Clients</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">15+</div>
                  <div className="text-sm text-gray-600">Expert Stylists</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">5★</div>
                  <div className="text-sm text-gray-600">Average Rating</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="relative z-10 bg-white rounded-3xl shadow-2xl overflow-hidden">
                <div className="aspect-[3/4] bg-gradient-to-br from-pink-100 to-purple-100 flex items-center justify-center">
                  <div className="text-center space-y-4">
                    <div className="w-24 h-24 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full mx-auto flex items-center justify-center">
                      <Sparkles className="h-12 w-12 text-white" />
                    </div>
                    <p className="text-lg font-medium text-gray-700">
                      Transform Your Look Today
                    </p>
                  </div>
                </div>
              </div>
              <div className="absolute -top-6 -left-6 w-24 h-24 bg-pink-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-purple-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Why Choose Luxe Beauty Lounge?</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We're committed to providing exceptional service and creating beautiful experiences for every client
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-sm hover:shadow-md transition-shadow group">
                <CardContent className="p-6 text-center">
                  <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform">
                    <feature.icon className="h-8 w-8 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{feature.title}</h3>
                  <p className="text-gray-600">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Premium Services</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From cutting-edge styles to luxurious spa treatments, we offer a complete range of beauty services
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <Card key={index} className="group hover:shadow-lg transition-all duration-300 border-0 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-pink-500 to-purple-600 p-6 text-white relative">
                    {service.popular && (
                      <Badge className="absolute top-4 right-4 bg-yellow-400 text-yellow-900 border-0">
                        Popular
                      </Badge>
                    )}
                    <service.icon className="h-10 w-10 mb-4" />
                    <h3 className="text-xl font-semibold mb-2">{service.name}</h3>
                    <p className="text-pink-100">{service.description}</p>
                  </div>
                  <div className="p-6">
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-gray-900">{service.price}</span>
                      <Button 
                        size="sm" 
                        variant="outline"
                        className="border-pink-300 text-pink-600 hover:bg-pink-50 group-hover:bg-pink-500 group-hover:text-white group-hover:border-pink-500"
                        onClick={() => window.open('tel:+918012345678')}
                      >
                        Book Now
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Clients Say</h2>
            <p className="text-lg text-gray-600">Real reviews from real people who love our services</p>
          </div>
          
          <div className="relative max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg overflow-hidden">
              <CardContent className="p-8 text-center">
                <div className="flex justify-center mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-5 w-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <blockquote className="text-xl italic text-gray-700 mb-6 leading-relaxed">
                  "{testimonials[currentTestimonial].text}"
                </blockquote>
                <div className="space-y-2">
                  <div className="text-lg font-semibold text-gray-900">
                    {testimonials[currentTestimonial].name}
                  </div>
                  <Badge variant="outline" className="text-pink-600 border-pink-300">
                    {testimonials[currentTestimonial].service}
                  </Badge>
                </div>
              </CardContent>
            </Card>
            
            <Button
              variant="outline"
              size="icon"
              className="absolute left-4 top-1/2 transform -translate-y-1/2 border-gray-300 hover:bg-gray-50"
              onClick={prevTestimonial}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="icon"
              className="absolute right-4 top-1/2 transform -translate-y-1/2 border-gray-300 hover:bg-gray-50"
              onClick={nextTestimonial}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
          
          <div className="flex justify-center mt-6 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-colors ${
                  index === currentTestimonial ? 'bg-pink-500' : 'bg-gray-300'
                }`}
                onClick={() => setCurrentTestimonial(index)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-16 bg-gradient-to-br from-pink-50 to-purple-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl font-bold text-gray-900">About Luxe Beauty Lounge</h2>
              <p className="text-lg text-gray-600 leading-relaxed">
                For over a decade, Luxe Beauty Lounge has been the premier destination for luxury beauty 
                services in the heart of the city. Our team of expert stylists and beauty professionals 
                are passionate about making you look and feel your absolute best.
              </p>
              <div className="space-y-4">
                {[
                  "Certified and experienced professional stylists",
                  "Premium, eco-friendly, and cruelty-free products",
                  "Personalized consultations for every service",
                  "Relaxing and luxurious salon atmosphere",
                  "Latest techniques and trending styles"
                ].map((item, index) => (
                  <div key={index} className="flex items-center space-x-3">
                    <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0" />
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative">
              <div className="aspect-square bg-gradient-to-br from-pink-200 to-purple-200 rounded-3xl flex items-center justify-center">
                <Crown className="h-32 w-32 text-pink-600" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 bg-gray-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Visit Our Salon</h2>
            <p className="text-gray-300 text-lg">Experience luxury beauty services in a relaxing environment</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Location</h3>
                <p className="text-gray-300">
                  123 MG Road, Brigade Gateway<br />
                  Bengaluru, Karnataka 560025
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-6 text-center">
                <Clock className="h-8 w-8 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Hours</h3>
                <p className="text-gray-300">
                  Mon - Fri: 9AM - 8PM<br />
                  Sat - Sun: 10AM - 6PM
                </p>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800 border-gray-700 text-white">
              <CardContent className="p-6 text-center">
                <Phone className="h-8 w-8 text-pink-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">Contact</h3>
                <p className="text-gray-300">
                  +91 80 1234 5678<br />
                  info@luxebeautylounge.com
                </p>
              </CardContent>
            </Card>
          </div>
          
          <div className="text-center mt-12">
            <Button 
              size="lg"
              className="bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white px-8 py-3"
              onClick={() => window.open('tel:+918012345678')}
            >
              <Phone className="mr-2 h-5 w-5" />
              Call to Book Now
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-black text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Scissors className="h-5 w-5 text-white" />
              </div>
              <span className="text-lg font-semibold">Luxe Beauty Lounge</span>
            </div>
            
            <div className="flex items-center space-x-6">
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </a>
              <a href="#" className="text-gray-400 hover:text-pink-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </a>
              <button 
                onClick={() => navigate('/login')}
                className="text-gray-400 hover:text-pink-400 transition-colors text-sm"
              >
                Staff Portal
              </button>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-6 pt-6 text-center text-gray-400 text-sm">
            <p>&copy; 2025 Luxe Beauty Lounge. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;