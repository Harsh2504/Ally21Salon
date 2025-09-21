import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scissors, Clock, DollarSign, Search, Filter, Star } from 'lucide-react';

const ServiceCatalog = () => {
  // Mock data for services - this will be replaced with API calls later
  const [services] = useState([
    {
      id: 1,
      name: 'Hair Cut & Style',
      description: 'Professional haircut with styling using premium products. Includes consultation, wash, cut, and styling.',
      duration: 45,
      price: 50,
      category: 'Hair',
      rating: 4.8,
      reviews: 124,
      image: '✂️',
      requirements: ['Hair cutting certification', 'Basic styling skills'],
      tips: 'Focus on face shape and client preferences'
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Full hair coloring service with premium products. Includes color consultation, application, and aftercare guidance.',
      duration: 120,
      price: 120,
      category: 'Hair',
      rating: 4.9,
      reviews: 89,
      image: '🎨',
      requirements: ['Color specialist certification', 'Color theory knowledge'],
      tips: 'Always perform a strand test first'
    },
    {
      id: 3,
      name: 'Deep Conditioning Treatment',
      description: 'Intensive hair treatment to restore moisture and shine. Perfect for damaged or dry hair.',
      duration: 30,
      price: 35,
      category: 'Hair',
      rating: 4.7,
      reviews: 156,
      image: '💆‍♀️',
      requirements: ['Hair treatment knowledge', 'Product application skills'],
      tips: 'Use heat for better penetration'
    },
    {
      id: 4,
      name: 'Facial Treatment',
      description: 'Deep cleansing facial with moisturizing. Includes steaming, exfoliation, and mask application.',
      duration: 60,
      price: 80,
      category: 'Skincare',
      rating: 4.6,
      reviews: 78,
      image: '🧴',
      requirements: ['Esthetics license', 'Skin analysis skills'],
      tips: 'Assess skin type before treatment'
    },
    {
      id: 5,
      name: 'Anti-Aging Facial',
      description: 'Advanced facial treatment targeting fine lines and wrinkles. Includes specialized serums and massage.',
      duration: 90,
      price: 130,
      category: 'Skincare',
      rating: 4.9,
      reviews: 45,
      image: '✨',
      requirements: ['Advanced esthetics training', 'Anti-aging product knowledge'],
      tips: 'Use gentle upward motions during massage'
    },
    {
      id: 6,
      name: 'Classic Manicure',
      description: 'Complete nail care including cuticle care, shaping, and polish application.',
      duration: 30,
      price: 35,
      category: 'Nails',
      rating: 4.5,
      reviews: 203,
      image: '💅',
      requirements: ['Nail technician license', 'Sanitation knowledge'],
      tips: 'Always sanitize tools between clients'
    },
    {
      id: 7,
      name: 'Gel Manicure',
      description: 'Long-lasting gel polish application with LED curing. Includes nail prep and aftercare.',
      duration: 45,
      price: 50,
      category: 'Nails',
      rating: 4.8,
      reviews: 167,
      image: '💎',
      requirements: ['Gel application certification', 'LED lamp operation'],
      tips: 'Thin layers cure better than thick ones'
    },
    {
      id: 8,
      name: 'Spa Pedicure',
      description: 'Relaxing foot treatment with exfoliation, massage, and polish. Includes callus removal.',
      duration: 60,
      price: 60,
      category: 'Nails',
      rating: 4.7,
      reviews: 134,
      image: '🦶',
      requirements: ['Pedicure certification', 'Foot massage techniques'],
      tips: 'Soak feet for at least 10 minutes'
    },
    {
      id: 9,
      name: 'Eyebrow Threading',
      description: 'Precision eyebrow shaping using traditional threading technique.',
      duration: 15,
      price: 20,
      category: 'Beauty',
      rating: 4.4,
      reviews: 298,
      image: '👁️',
      requirements: ['Threading certification', 'Brow shaping skills'],
      tips: 'Follow natural brow shape'
    },
    {
      id: 10,
      name: 'Lash Extensions',
      description: 'Individual eyelash extension application for fuller, longer lashes.',
      duration: 90,
      price: 100,
      category: 'Beauty',
      rating: 4.8,
      reviews: 67,
      image: '👀',
      requirements: ['Lash extension certification', 'Precision application skills'],
      tips: 'Isolate each natural lash perfectly'
    },
    {
      id: 11,
      name: 'Makeup Application',
      description: 'Professional makeup application for special events or everyday wear.',
      duration: 45,
      price: 65,
      category: 'Beauty',
      rating: 4.6,
      reviews: 89,
      image: '💄',
      requirements: ['Makeup artistry skills', 'Color matching expertise'],
      tips: 'Always start with a clean, moisturized face'
    },
    {
      id: 12,
      name: 'Bridal Package',
      description: 'Complete bridal beauty package including hair, makeup, and nails for the perfect wedding day look.',
      duration: 180,
      price: 300,
      category: 'Special',
      rating: 5.0,
      reviews: 23,
      image: '👰',
      requirements: ['Multiple certifications', 'Bridal styling experience'],
      tips: 'Schedule a trial run before the wedding'
    }
  ]);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');

  const categories = ['All', 'Hair', 'Skincare', 'Nails', 'Beauty', 'Special'];
  const sortOptions = [
    { value: 'name', label: 'Name A-Z' },
    { value: 'price-low', label: 'Price: Low to High' },
    { value: 'price-high', label: 'Price: High to Low' },
    { value: 'duration', label: 'Duration' },
    { value: 'rating', label: 'Rating' }
  ];

  const filteredAndSortedServices = services
    .filter(service => {
      const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          service.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = filterCategory === 'All' || service.category === filterCategory;
      return matchesSearch && matchesCategory;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case 'name':
          return a.name.localeCompare(b.name);
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'duration':
          return a.duration - b.duration;
        case 'rating':
          return b.rating - a.rating;
        default:
          return 0;
      }
    });

  const getCategoryColor = (category) => {
    const colors = {
      'Hair': 'bg-blue-100 text-blue-800',
      'Skincare': 'bg-green-100 text-green-800',
      'Nails': 'bg-purple-100 text-purple-800',
      'Beauty': 'bg-pink-100 text-pink-800',
      'Special': 'bg-yellow-100 text-yellow-800'
    };
    return colors[category] || 'bg-gray-100 text-gray-800';
  };

  const renderStars = (rating) => {
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;
    const stars = [];

    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />);
    }

    if (hasHalfStar) {
      stars.push(<Star key="half" className="h-4 w-4 fill-yellow-200 text-yellow-400" />);
    }

    const remainingStars = 5 - Math.ceil(rating);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} className="h-4 w-4 text-gray-300" />);
    }

    return stars;
  };

  const totalServices = services.length;
  const avgPrice = services.reduce((sum, s) => sum + s.price, 0) / services.length;
  const avgDuration = services.reduce((sum, s) => sum + s.duration, 0) / services.length;
  const avgRating = services.reduce((sum, s) => sum + s.rating, 0) / services.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold">Service Catalog</h2>
        <p className="text-gray-600">Browse all available salon services and their details</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Scissors className="h-8 w-8 text-blue-500" />
              <div>
                <p className="text-2xl font-bold">{totalServices}</p>
                <p className="text-sm text-gray-600">Total Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">${avgPrice.toFixed(0)}</p>
                <p className="text-sm text-gray-600">Avg Price</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">{avgDuration.toFixed(0)}m</p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Star className="h-8 w-8 text-yellow-500 fill-yellow-500" />
              <div>
                <p className="text-2xl font-bold">{avgRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note about UI-only implementation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a UI-only implementation. Service data is mock data and will be lost on refresh. 
            Backend integration for service management will be implemented in future updates.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search services..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex space-x-2">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {categories.map(category => (
              <option key={category} value={category}>
                {category === 'All' ? 'All Categories' : category}
              </option>
            ))}
          </select>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {sortOptions.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Services Grid */}
      {filteredAndSortedServices.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedServices.map((service) => (
            <Card key={service.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="text-3xl">{service.image}</div>
                    <div>
                      <CardTitle className="text-lg">{service.name}</CardTitle>
                      <Badge className={getCategoryColor(service.category)}>
                        {service.category}
                      </Badge>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">${service.price}</div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <CardDescription>{service.description}</CardDescription>

                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4 text-gray-500" />
                    <span>{service.duration} minutes</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    {renderStars(service.rating)}
                    <span className="text-gray-600 ml-1">({service.reviews})</span>
                  </div>
                </div>

                <div>
                  <p className="text-sm font-medium text-gray-700 mb-2">Requirements:</p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    {service.requirements.map((req, index) => (
                      <li key={index} className="flex items-center space-x-2">
                        <span className="w-1 h-1 bg-gray-400 rounded-full"></span>
                        <span>{req}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="text-sm font-medium text-blue-800 mb-1">Pro Tip:</p>
                  <p className="text-xs text-blue-700">{service.tips}</p>
                </div>

                <Button variant="outline" className="w-full">
                  View Full Details
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-500">
              Try adjusting your search terms or filters.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Category Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Services by Category</CardTitle>
          <CardDescription>Quick overview of available service categories</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            {categories.slice(1).map(category => {
              const categoryServices = services.filter(s => s.category === category);
              const avgCategoryPrice = categoryServices.reduce((sum, s) => sum + s.price, 0) / categoryServices.length;
              
              return (
                <div key={category} className="text-center p-4 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <div className="text-2xl mb-2">
                    {category === 'Hair' && '✂️'}
                    {category === 'Skincare' && '🧴'}
                    {category === 'Nails' && '💅'}
                    {category === 'Beauty' && '💄'}
                    {category === 'Special' && '✨'}
                  </div>
                  <h3 className="font-medium">{category}</h3>
                  <p className="text-sm text-gray-600">{categoryServices.length} services</p>
                  <p className="text-sm text-green-600 font-medium">Avg ${avgCategoryPrice.toFixed(0)}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceCatalog;