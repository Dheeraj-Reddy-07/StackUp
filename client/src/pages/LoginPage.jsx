// ============================================
// Login Page
// ============================================
// User authentication login form

import { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Layers, ArrowRight } from 'lucide-react';
import { Button, Input, Card } from '../components/ui';
import toast from 'react-hot-toast';

const LoginPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const { login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    // Get redirect path from location state
    const from = location.state?.from?.pathname || '/welcome';

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        // Clear error when user types
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        try {
            await login(formData.email, formData.password);
            toast.success('Welcome back!');
            navigate(from, { replace: true });
        } catch (error) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] flex items-center justify-center py-12 px-4 transition-colors">
            <div className="max-w-md w-full">
                {/* Logo */}
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center gap-2">
                        <div className="w-10 h-10 bg-primary-600 rounded-xl flex items-center justify-center">
                            <Layers className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-2xl font-bold text-[var(--color-text-primary)]">StackUp</span>
                    </Link>
                    <h1 className="mt-6 text-2xl font-bold text-[var(--color-text-primary)]">Welcome back</h1>
                    <p className="mt-2 text-[var(--color-text-secondary)]">Log in to your account to continue</p>
                </div>

                {/* Login Form */}
                <Card className="p-8">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <Input
                            label="Email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="you@example.com"
                            error={errors.email}
                        />

                        <Input
                            label="Password"
                            type="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="••••••••"
                            error={errors.password}
                        />

                        <Button
                            type="submit"
                            className="w-full"
                            size="lg"
                            loading={loading}
                        >
                            Log in
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </form>
                </Card>

                {/* Sign up link */}
                <p className="mt-6 text-center text-[var(--color-text-secondary)]">
                    Don't have an account?{' '}
                    <Link to="/signup" className="text-primary-600 font-medium hover:text-primary-700">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;
