// ============================================
// Landing Page
// ============================================
// Main hero page with CTAs and features

import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import {
    Users,
    Rocket,
    Code,
    BookOpen,
    ArrowRight,
    CheckCircle,
    Zap,
    Shield,
    MessageSquare
} from 'lucide-react';
import Button from '../components/ui/Button';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Redirect authenticated users to welcome page
    useEffect(() => {
        if (isAuthenticated) {
            navigate('/welcome');
        }
    }, [isAuthenticated, navigate]);

    const features = [
        {
            icon: <Rocket className="w-6 h-6" />,
            title: 'Hackathon Teams',
            description: 'Find skilled teammates for hackathons and coding competitions. Build winning projects together.'
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: 'Project Collaboration',
            description: 'Connect with developers to build side projects, open source contributions, or portfolio pieces.'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Startup Building',
            description: 'Find co-founders and early team members for your startup idea. Build something meaningful.'
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: 'Study Groups',
            description: 'Form study groups for placements, competitive programming, or technical interviews.'
        }
    ];

    const benefits = [
        'Find teammates with complementary skills',
        'Private team chat for collaboration',
        'Easy application management',
        'Built for engineering students'
    ];

    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="container-app relative z-10 py-20 md:py-32">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Build Your Dream Team
                            <span className="block text-primary-200">For Any Tech Challenge</span>
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 mb-10 max-w-2xl mx-auto">
                            StackUp is the collaboration platform for engineering students.
                            Find teammates for hackathons, projects, startups, and study groups.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <Link to={isAuthenticated ? '/openings/new' : '/signup'}>
                                <Button size="lg" className="w-full sm:w-auto bg-white text-primary-700 hover:bg-primary-50">
                                    Post an Opening
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/browse">
                                <Button size="lg" variant="ghost" className="w-full sm:w-auto border-2 border-white/30 text-white hover:bg-white/10">
                                    Browse Openings
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
                        {[
                            { label: 'Active Openings', value: '500+' },
                            { label: 'Teams Formed', value: '200+' },
                            { label: 'Students', value: '1000+' },
                            { label: 'Colleges', value: '50+' }
                        ].map((stat) => (
                            <div key={stat.label} className="text-center">
                                <div className="text-3xl md:text-4xl font-bold mb-1">{stat.value}</div>
                                <div className="text-primary-200 text-sm">{stat.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-20 md:py-28">
                <div className="container-app">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            Everything You Need to Build Great Teams
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            Whether it's a 24-hour hackathon or a semester-long project,
                            StackUp helps you find the right people.
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="bg-white rounded-2xl p-6 shadow-soft border border-gray-100 hover:shadow-lg hover:border-primary-100 transition-all duration-300 group"
                            >
                                <div className="w-12 h-12 bg-primary-100 rounded-xl flex items-center justify-center text-primary-600 mb-4 group-hover:bg-primary-600 group-hover:text-white transition-colors">
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] text-sm">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* How It Works */}
            <section className="py-20 bg-gray-50">
                <div className="container-app">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            How StackUp Works
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            Three simple steps to build your dream team
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        {[
                            {
                                step: '01',
                                title: 'Post an Opening',
                                description: 'Describe your project, required skills, and number of team slots needed.'
                            },
                            {
                                step: '02',
                                title: 'Review Applications',
                                description: 'Browse applications from interested students. Check their skills and profiles.'
                            },
                            {
                                step: '03',
                                title: 'Build Together',
                                description: 'Accept team members and collaborate using the private team chat.'
                            }
                        ].map((item, index) => (
                            <div key={index} className="relative text-center">
                                <div className="text-6xl font-bold text-primary-100 mb-4">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)]">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Benefits Section */}
            <section className="py-20">
                <div className="container-app">
                    <div className="grid md:grid-cols-2 gap-12 items-center">
                        <div>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                                Why Students Choose StackUp
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-lg mb-8">
                                Built specifically for engineering students, StackUp focuses on
                                what matters: finding the right teammates efficiently.
                            </p>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <CheckCircle className="w-5 h-5 text-success flex-shrink-0" />
                                        <span className="text-[var(--color-text-primary)]">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-8">
                                <Link to={isAuthenticated ? '/browse' : '/signup'}>
                                    <Button size="lg">
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="bg-primary-50 rounded-2xl p-6">
                                <Users className="w-8 h-8 text-primary-600 mb-3" />
                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">Teams</div>
                                <p className="text-[var(--color-text-secondary)] text-sm">Form perfect teams</p>
                            </div>
                            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-6">
                                <MessageSquare className="w-8 h-8 text-green-600 dark:text-green-400 mb-3" />
                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">Chat</div>
                                <p className="text-[var(--color-text-secondary)] text-sm">Real-time messaging</p>
                            </div>
                            <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6">
                                <Shield className="w-8 h-8 text-amber-600 dark:text-amber-400 mb-3" />
                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">Privacy</div>
                                <p className="text-[var(--color-text-secondary)] text-sm">Team-only access</p>
                            </div>
                            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-2xl p-6">
                                <Zap className="w-8 h-8 text-purple-600 dark:text-purple-400 mb-3" />
                                <div className="text-2xl font-bold text-[var(--color-text-primary)]">Fast</div>
                                <p className="text-[var(--color-text-secondary)] text-sm">Quick matching</p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="py-20 bg-gray-900 text-white">
                <div className="container-app text-center">
                    <h2 className="text-3xl md:text-4xl font-bold mb-4">
                        Ready to Build Something Amazing?
                    </h2>
                    <p className="text-gray-400 text-lg mb-8 max-w-2xl mx-auto">
                        Join thousands of engineering students who are collaborating on
                        hackathons, projects, and startups.
                    </p>
                    <Link to={isAuthenticated ? '/browse' : '/signup'}>
                        <Button size="lg" className="bg-white text-gray-900 hover:bg-gray-100">
                            Get Started Now
                            <ArrowRight className="w-5 h-5 ml-2" />
                        </Button>
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
