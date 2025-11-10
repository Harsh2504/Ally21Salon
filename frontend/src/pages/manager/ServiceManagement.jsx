import React, { useState, useEffect, useCallback, memo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { 
  Plus, Edit, Trash2, Search, Scissors, Clock, IndianRupee, 
  X, Save, AlertCircle 
} from 'lucide-react';
import { toast } from 'sonner';
import { api } from '@/services/api';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: '',
    image: '',
    requirements: [],
  });
  const [error, setError] = useState('');

  const serviceCategories = [
    'Haircut', 'Coloring', 'Styling', 'Treatment', 
    'Nails', 'Facial', 'Massage', 'Other'
  ];

  useEffect(() => {
    fetchServices();
    fetchCategories();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchTerm) params.append('search', searchTerm);
      if (selectedCategory) params.append('category', selectedCategory);
      
      const response = await api.get(`/services?${params.toString()}`);
      setServices(response.data.services || []);
    } catch (error) {
      console.error('Error fetching services:', error);
      toast.error('Failed to fetch services');
      setServices([]);
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
    const timeoutId = setTimeout(() => {
      fetchServices();
    }, 500);
    return () => clearTimeout(timeoutId);
  }, [searchTerm, selectedCategory]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    setError('');
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      duration: '',
      price: '',
      category: '',
      image: '',
      requirements: [],
    });
    setError('');
  };

  const handleAddService = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const serviceData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        requirements: formData.requirements.filter(req => req.trim() !== ''),
      };

      await api.post('/services', serviceData);
      await fetchServices();
      setShowAddForm(false);
      resetForm();
      toast.success('Service added successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to add service';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditService = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setError('');

    try {
      const serviceData = {
        ...formData,
        duration: parseInt(formData.duration),
        price: parseFloat(formData.price),
        requirements: formData.requirements.filter(req => req.trim() !== ''),
      };

      await api.put(`/services/${editingService._id}`, serviceData);
      await fetchServices();
      setEditingService(null);
      resetForm();
      toast.success('Service updated successfully!');
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Failed to update service';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!window.confirm('Are you sure you want to delete this service?')) {
      return;
    }

    try {
      await api.delete(`/services/${serviceId}`);
      await fetchServices();
      toast.success('Service deleted successfully!');
    } catch (error) {
      const errorMessage = 'Failed to delete service';
      toast.error(errorMessage);
    }
  };

  const startEditService = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category,
      image: service.image || '',
      requirements: service.requirements || [],
    });
    setShowAddForm(true);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setShowAddForm(false);
    resetForm();
  };

  const addRequirement = () => {
    setFormData({
      ...formData,
      requirements: [...formData.requirements, ''],
    });
  };

  const updateRequirement = (index, value) => {
    const newRequirements = [...formData.requirements];
    newRequirements[index] = value;
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const removeRequirement = (index) => {
    const newRequirements = formData.requirements.filter((_, i) => i !== index);
    setFormData(prev => ({
      ...prev,
      requirements: newRequirements,
    }));
  };

  const formatDuration = (minutes) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Service Management</h1>
          <p className="text-gray-600">Manage your salon services and pricing</p>
        </div>
        <Button onClick={() => setShowAddForm(true)} disabled={showAddForm}>
          <Plus className="h-4 w-4 mr-2" />
          Add New Service
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Services</p>
                <p className="text-2xl font-bold text-gray-900">{services.length}</p>
              </div>
              <Scissors className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Services</p>
                <p className="text-2xl font-bold text-green-600">
                  {services.filter(s => s.isActive).length}
                </p>
              </div>
              <Clock className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Avg Price</p>
                <p className="text-2xl font-bold text-purple-600">
                  ₹{services.length > 0 ? (services.reduce((acc, s) => acc + s.price, 0) / services.length).toFixed(2) : '0.00'}
                </p>
              </div>
              <IndianRupee className="h-8 w-8 text-purple-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Add/Edit Form */}
      {showAddForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>{editingService ? 'Edit Service' : 'Add New Service'}</span>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={editingService ? handleEditService : handleAddService} className="space-y-4">
              {error && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded flex items-center gap-2">
                  <AlertCircle className="h-4 w-4" />
                  {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Service Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    placeholder="Enter service name"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    <option value="">Select category</option>
                    {serviceCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <Label htmlFor="duration">Duration (minutes) *</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    min="15"
                    max="480"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="45"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="price">Price (₹) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.price}
                    onChange={handleInputChange}
                    placeholder="50.00"
                    required
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  placeholder="Enter detailed service description"
                  className="min-h-[100px]"
                  required
                />
              </div>

              <div>
                <Label htmlFor="image">Image URL (optional)</Label>
                <Input
                  id="image"
                  name="image"
                  type="url"
                  value={formData.image}
                  onChange={handleInputChange}
                  placeholder="https://example.com/service-image.jpg"
                />
              </div>

              <div>
                <Label>Special Requirements (optional)</Label>
                {formData.requirements.map((req, index) => (
                  <div key={`requirement-${index}-${req}`} className="flex gap-2 mb-2">
                    <Input
                      value={req}
                      onChange={(e) => updateRequirement(index, e.target.value)}
                      placeholder="Enter requirement"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => removeRequirement(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addRequirement}
                  className="mt-2"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Requirement
                </Button>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" disabled={formLoading}>
                  <Save className="h-4 w-4 mr-2" />
                  {formLoading ? 'Saving...' : editingService ? 'Update Service' : 'Add Service'}
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

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
                {serviceCategories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>Services</CardTitle>
          <CardDescription>
            {services.length} service{services.length !== 1 ? 's' : ''} total
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : services.length === 0 ? (
            <div className="text-center py-8">
              <Scissors className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No services found</h3>
              <p className="text-gray-600 mb-4">
                {searchTerm || selectedCategory
                  ? 'Try adjusting your search or filters'
                  : 'Get started by adding your first service'
                }
              </p>
              {!searchTerm && !selectedCategory && (
                <Button onClick={() => setShowAddForm(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Service
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Service</TableHead>
                    <TableHead>Category</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {services.map((service) => (
                    <TableRow key={service._id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900">{service.name}</div>
                          <div className="text-sm text-gray-600 max-w-xs truncate">
                            {service.description}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="secondary">{service.category}</Badge>
                      </TableCell>
                      <TableCell>{formatDuration(service.duration)}</TableCell>
                      <TableCell className="font-medium">₹{service.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <Badge 
                          variant={service.isActive ? "default" : "secondary"}
                          className={service.isActive ? "bg-green-100 text-green-800" : ""}
                        >
                          {service.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => startEditService(service)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteService(service._id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManagement;