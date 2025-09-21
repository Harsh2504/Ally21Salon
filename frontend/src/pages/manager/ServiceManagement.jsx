import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Search, Scissors, Clock, DollarSign } from 'lucide-react';

const ServiceManagement = () => {
  // Mock data for services - this will be replaced with API calls later
  const [services, setServices] = useState([
    {
      id: 1,
      name: 'Hair Cut & Style',
      description: 'Professional haircut with styling',
      duration: 45,
      price: 50,
      category: 'Hair',
      status: 'Active'
    },
    {
      id: 2,
      name: 'Hair Coloring',
      description: 'Full hair coloring service with premium products',
      duration: 120,
      price: 120,
      category: 'Hair',
      status: 'Active'
    },
    {
      id: 3,
      name: 'Facial Treatment',
      description: 'Deep cleansing facial with moisturizing',
      duration: 60,
      price: 80,
      category: 'Skincare',
      status: 'Active'
    },
    {
      id: 4,
      name: 'Manicure',
      description: 'Complete nail care and polish',
      duration: 30,
      price: 35,
      category: 'Nails',
      status: 'Active'
    },
    {
      id: 5,
      name: 'Pedicure',
      description: 'Foot care and nail treatment',
      duration: 45,
      price: 45,
      category: 'Nails',
      status: 'Active'
    },
    {
      id: 6,
      name: 'Eyebrow Threading',
      description: 'Precision eyebrow shaping',
      duration: 15,
      price: 20,
      category: 'Beauty',
      status: 'Inactive'
    }
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    duration: '',
    price: '',
    category: 'Hair'
  });

  const categories = ['Hair', 'Skincare', 'Nails', 'Beauty'];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleAddService = (e) => {
    e.preventDefault();
    const newService = {
      id: services.length + 1,
      ...formData,
      duration: parseInt(formData.duration),
      price: parseFloat(formData.price),
      status: 'Active'
    };
    setServices([...services, newService]);
    setShowAddForm(false);
    setFormData({ name: '', description: '', duration: '', price: '', category: 'Hair' });
  };

  const handleEditService = (e) => {
    e.preventDefault();
    const updatedServices = services.map(service =>
      service.id === editingService.id
        ? {
            ...service,
            ...formData,
            duration: parseInt(formData.duration),
            price: parseFloat(formData.price)
          }
        : service
    );
    setServices(updatedServices);
    setEditingService(null);
    setFormData({ name: '', description: '', duration: '', price: '', category: 'Hair' });
  };

  const handleDeleteService = (serviceId) => {
    if (window.confirm('Are you sure you want to delete this service?')) {
      setServices(services.filter(service => service.id !== serviceId));
    }
  };

  const toggleServiceStatus = (serviceId) => {
    const updatedServices = services.map(service =>
      service.id === serviceId
        ? { ...service, status: service.status === 'Active' ? 'Inactive' : 'Active' }
        : service
    );
    setServices(updatedServices);
  };

  const startEdit = (service) => {
    setEditingService(service);
    setFormData({
      name: service.name,
      description: service.description,
      duration: service.duration.toString(),
      price: service.price.toString(),
      category: service.category
    });
    setShowAddForm(false);
  };

  const cancelEdit = () => {
    setEditingService(null);
    setFormData({ name: '', description: '', duration: '', price: '', category: 'Hair' });
  };

  const cancelAdd = () => {
    setShowAddForm(false);
    setFormData({ name: '', description: '', duration: '', price: '', category: 'Hair' });
  };

  const filteredServices = services.filter(service => {
    const matchesSearch = service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         service.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'All' || service.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const totalServices = services.length;
  const activeServices = services.filter(s => s.status === 'Active').length;
  const totalRevenue = services.filter(s => s.status === 'Active').reduce((sum, s) => sum + s.price, 0);
  const avgDuration = Math.round(services.reduce((sum, s) => sum + s.duration, 0) / services.length);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Service Management</h2>
          <p className="text-gray-600">Manage salon services and pricing</p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          disabled={showAddForm || editingService}
        >
          <Plus className="mr-2 h-4 w-4" />
          Add Service
        </Button>
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
              <Scissors className="h-8 w-8 text-green-500" />
              <div>
                <p className="text-2xl font-bold">{activeServices}</p>
                <p className="text-sm text-gray-600">Active Services</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <DollarSign className="h-8 w-8 text-purple-500" />
              <div>
                <p className="text-2xl font-bold">${totalRevenue}</p>
                <p className="text-sm text-gray-600">Potential Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center space-x-2">
              <Clock className="h-8 w-8 text-orange-500" />
              <div>
                <p className="text-2xl font-bold">{avgDuration}m</p>
                <p className="text-sm text-gray-600">Avg Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Note about UI-only implementation */}
      <Card className="border-blue-200 bg-blue-50">
        <CardContent className="p-4">
          <p className="text-blue-800 text-sm">
            <strong>Note:</strong> This is a UI-only implementation. Service data is stored locally and will be lost on refresh. 
            Backend integration for service management will be implemented in future updates.
          </p>
        </CardContent>
      </Card>

      {/* Search and Filter */}
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
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="All">All Categories</option>
          {categories.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>
      </div>

      {/* Add Service Form */}
      {showAddForm && (
        <Card>
          <CardHeader>
            <CardTitle>Add New Service</CardTitle>
            <CardDescription>Create a new salon service</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleAddService} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Service Name</Label>
                  <Input
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration (minutes)</Label>
                  <Input
                    id="duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Price ($)</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">Add Service</Button>
                <Button type="button" variant="outline" onClick={cancelAdd}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Edit Service Form */}
      {editingService && (
        <Card>
          <CardHeader>
            <CardTitle>Edit Service</CardTitle>
            <CardDescription>Update service information</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleEditService} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="edit-name">Service Name</Label>
                  <Input
                    id="edit-name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-category">Category</Label>
                  <select
                    id="edit-category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-duration">Duration (minutes)</Label>
                  <Input
                    id="edit-duration"
                    name="duration"
                    type="number"
                    value={formData.duration}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="edit-price">Price ($)</Label>
                  <Input
                    id="edit-price"
                    name="price"
                    type="number"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-description">Description</Label>
                <Textarea
                  id="edit-description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={3}
                  required
                />
              </div>
              
              <div className="flex space-x-2">
                <Button type="submit">Update Service</Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>Cancel</Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      {/* Services Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Services ({filteredServices.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {filteredServices.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Price</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredServices.map((service) => (
                  <TableRow key={service.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{service.name}</p>
                        <p className="text-sm text-gray-600">{service.description}</p>
                      </div>
                    </TableCell>
                    <TableCell>{service.category}</TableCell>
                    <TableCell>{service.duration} min</TableCell>
                    <TableCell>${service.price}</TableCell>
                    <TableCell>
                      <Badge 
                        className={service.status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}
                        onClick={() => toggleServiceStatus(service.id)}
                        style={{ cursor: 'pointer' }}
                      >
                        {service.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex space-x-2 justify-end">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(service)}
                          disabled={showAddForm || editingService}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleDeleteService(service.id)}
                          disabled={showAddForm || editingService}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <p className="text-center text-gray-500 py-8">No services found</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ServiceManagement;