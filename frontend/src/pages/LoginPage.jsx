import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { toast } from 'sonner';
import { PageLoader } from '../components/shared/Loader';
import { Scissors, ArrowLeft } from 'lucide-react';

const LoginPage = () => {
  const { login, user, loading } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if already logged in
  if (!loading && user) {
    const redirectPath = user.role === 'Manager' ? '/manager/dashboard' : '/employee/dashboard';
    return <Navigate to={redirectPath} replace />;
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError(''); // Clear error when user types
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const result = await login(formData);
      if (result.success) {
        toast.success('Login successful! Redirecting...');
        // Navigation will be handled by the Navigate component above
      } else {
        setError(result.error);
        toast.error(result.error);
      }
    } catch (error) {
      const errorMessage = 'An unexpected error occurred. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  if (loading) {
    return <PageLoader text="Loading application..." />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-purple-50 to-indigo-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-purple-500/5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-72 h-72 bg-yellow-200 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      
      {/* Back to Home Button */}
      <div className="absolute top-6 left-6 z-10">
        <Button
          variant="outline"
          onClick={() => navigate('/')}
          className="bg-white/80 backdrop-blur-sm border-gray-200 text-gray-700 hover:bg-white hover:text-pink-600 transition-colors"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>
      </div>

      <div className="relative min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-md w-full space-y-8">
          {/* Header */}
          <div className="text-center">
            <div className="flex items-center justify-center space-x-3 mb-6">
              <div className="w-16 h-16 bg-gradient-to-br from-pink-500 to-purple-600 rounded-full flex items-center justify-center">
                <Scissors className="h-8 w-8 text-white" />
              </div>
              <div className="text-left">
                <h1 className="text-2xl font-bold bg-gradient-to-r from-pink-600 to-purple-600 bg-clip-text text-transparent">
                  Luxe Beauty Lounge
                </h1>
                <p className="text-xs text-gray-500">Staff Portal</p>
              </div>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome Back
            </h2>
            <p className="text-gray-600">
              Sign in to access your staff dashboard
            </p>
          </div>
          
          <Card className="backdrop-blur-sm bg-white/90 border-0 shadow-2xl">
            <CardHeader className="text-center pb-4">
              <CardTitle className="text-xl text-gray-900">Staff Sign In</CardTitle>
              <CardDescription className="text-gray-600">
                Enter your credentials to continue
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                    {error}
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="email" className="text-gray-700 font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="staff@luxebeautylounge.com"
                    className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password" className="text-gray-700 font-medium">
                    Password
                  </Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    placeholder="Enter your password"
                    className="border-gray-200 focus:border-pink-500 focus:ring-pink-500"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-pink-500 to-purple-600 hover:from-pink-600 hover:to-purple-700 text-white py-2.5 font-medium transition-all duration-200"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                      </svg>
                      Signing in...
                    </span>
                  ) : (
                    'Sign In'
                  )}
                </Button>
              </form>

              {/* Demo Credentials */}
              <div className="mt-8 p-4 bg-gray-50 rounded-lg border border-gray-200">
                <p className="text-sm font-medium text-gray-700 mb-2 text-center">Demo Credentials:</p>
                <div className="space-y-2 text-xs text-gray-600">
                  <div className="bg-white p-2 rounded border">
                    <strong>Manager:</strong> harsh@gmail.com
                    <br />
                    <strong>Password:</strong> P@ssword123
                  </div>
                  <div className="bg-white p-2 rounded border">
                    <strong>Employee:</strong> nam@gmail.com
                    <br />
                    <strong>Password:</strong> P@ssword123
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="text-center text-sm text-gray-500">
            <p>&copy; 2025 Luxe Beauty Lounge. All rights reserved.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;