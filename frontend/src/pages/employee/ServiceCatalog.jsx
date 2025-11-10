import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Scissors, Clock, IndianRupee, Search, Filter, Star, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

const ServiceCatalog = () => {
  const [services, setServices] = useState([]);
  const [filteredServices, setFilteredServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedService, setSelectedService] = useState(null);

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await api.get('/services?isActive=true');
      const servicesList = response.data.services || [];
      setServices(servicesList);
      setFilteredServices(servicesList);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setServices([]);
      setFilteredServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/services/categories');
      setCategories(response.data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  useEffect(() => {
    let filtered = services;

    if (searchTerm) {
      filtered = filtered.filter(service =>
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (selectedCategory) {
      filtered = filtered.filter(service => service.category === selectedCategory);
    }

    setFilteredServices(filtered);
  }, [services, searchTerm, selectedCategory]);

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  const getServiceIcon = (category) => {
    const icons = {
      'Haircut': '✂️',
      'Coloring': '🎨',
      'Styling': '💇‍♀️',
      'Treatment': '💆‍♀️',
      'Nails': '💅',
      'Facial': '🧴',
      'Massage': '🤲',
      'Other': '⭐'
    };
    return icons[category] || '⭐';
  };

  const ServiceCard = ({ service }) => (
    <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer" 
          onClick={() => setSelectedService(service)}>
      <CardHeader className="pb-4">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-3xl">{getServiceIcon(service.category)}</div>
            <div>
              <CardTitle className="text-lg">{service.name}</CardTitle>
              <Badge variant="secondary" className="mt-1">
                {service.category}
              </Badge>
            </div>
          </div>
          <div className="text-right">
            <div className="text-2xl font-bold text-green-600">
              ₹{service.price.toFixed(2)}
            </div>
            <div className="text-sm text-gray-600 flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {formatDuration(service.duration)}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm mb-4 line-clamp-3">
          {service.description}
        </CardDescription>
        
        {service.requirements && service.requirements.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">Requirements:</h4>
            <ul className="text-xs text-gray-600 space-y-1">
              {service.requirements.slice(0, 2).map((req, index) => (
                <li key={index} className="flex items-center gap-1">
                  <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
                  {req}
                </li>
              ))}
              {service.requirements.length > 2 && (
                <li className="text-gray-500">
                  +{service.requirements.length - 2} more requirements
                </li>
              )}
            </ul>
          </div>
        )}
      </CardContent>
    </Card>
  );

  const ServiceDetailModal = ({ service, onClose }) => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
          <h2 className="text-xl font-bold">{service.name}</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <div className="text-4xl">{getServiceIcon(service.category)}</div>
            <div className="flex-1">
              <Badge variant="secondary" className="mb-2">
                {service.category}
              </Badge>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <IndianRupee className="h-4 w-4 text-green-600" />
                  <span className="font-medium">₹{service.price.toFixed(2)}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-blue-600" />
                  <span>{formatDuration(service.duration)}</span>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-2">Description</h3>
            <p className="text-gray-700">{service.description}</p>
          </div>

          {service.requirements && service.requirements.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">Requirements</h3>
              <ul className="space-y-1">
                {service.requirements.map((req, index) => (
                  <li key={index} className="flex items-center gap-2 text-sm text-gray-700">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                    {req}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {service.image && (
            <div>
              <h3 className="font-semibold mb-2">Service Image</h3>
              <img 
                src={service.image} 
                alt={service.name}
                className="w-full h-48 object-cover rounded-lg"
                onError={(e) => {
                  e.target.style.display = 'none';
                }}
              />
            </div>
          )}

          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-semibold mb-2 flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-blue-600" />
              Service Information
            </h3>
            <div className="text-sm text-gray-700 space-y-1">
              <p>• This service takes approximately {formatDuration(service.duration)} to complete</p>
              <p>• Price: ₹{service.price.toFixed(2)} (prices may vary based on hair length/type)</p>
              <p>• Please arrive 10 minutes early for your appointment</p>
              <p>• Cancellations require 24-hour notice</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Catalog</h1>
          <p className="text-gray-600">Browse all available salon services</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-xl font-bold text-gray-900">{services.length}</p>
              </div>
              <Scissors className="h-6 w-6 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Categories</p>
                <p className="text-xl font-bold text-green-600">{categories.length}</p>
              </div>
              <Filter className="h-6 w-6 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Price Range</p>
                <p className="text-xl font-bold text-purple-600">
                  ₹{services.length > 0 ? Math.min(...services.map(s => s.price)) : 0} - 
                  ₹{services.length > 0 ? Math.max(...services.map(s => s.price)) : 0}
                </p>
              </div>
              <IndianRupee className="h-6 w-6 text-purple-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Average Duration</p>
                <p className="text-xl font-bold text-orange-600">
                  {services.length > 0 ? formatDuration(Math.round(services.reduce((acc, s) => acc + s.duration, 0) / services.length)) : '0m'}
                </p>
              </div>
              <Clock className="h-6 w-6 text-orange-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search services..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="sm:w-48">
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map(cat => (
                  <option key={cat.name} value={cat.name}>
                    {cat.name} ({cat.count})
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Grid */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredServices.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
            <p className="text-gray-600">
              {searchTerm || selectedCategory
                ? 'Try adjusting your search or filters'
                : 'No services are currently available'
              }
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredServices.map((service) => (
            <ServiceCard key={service._id} service={service} />
          ))}
        </div>
      )}

      {/* Service Detail Modal */}
      {selectedService && (
        <ServiceDetailModal
          service={selectedService}
          onClose={() => setSelectedService(null)}
        />
      )}
    </div>
  );
};

export default ServiceCatalog;