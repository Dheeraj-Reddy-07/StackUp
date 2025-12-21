// ============================================
// Welcome Page
// ============================================
// Welcome page shown after login

import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Users,
    Rocket,
    Plus,
    MessageSquare,
    ArrowRight,
    TrendingUp,
    Briefcase
} from 'lucide-react';
import Button from '../components/ui/Button';
import Card from '../components/ui/Card';

const WelcomePage = () => {
    const { user } = useAuth();

    const quickActions = [
        {
            icon: <Plus className="w-6 h-6" />,
            title: 'Post an Opening',
            description: 'Looking for teammates? Create a new opening.',
            link: '/openings/new',
            color: 'primary'
        },
        {
            icon: <Briefcase className="w-6 h-6" />,
            title: 'Browse Openings',
            description: 'Find exciting projects and teams to join.',
            link: '/browse',
            color: 'blue'
        },
        {
            icon: <Users className="w-6 h-6" />,
            title: 'My Dashboard',
            description: 'Manage your openings and applications.',
            link: '/dashboard',
            color: 'green'
        }
    ];

    const colorClasses = {
        primary: {
            bg: 'bg-primary-100 dark:bg-primary-900/20',
            text: 'text-primary-600 dark:text-primary-400',
            hover: 'group-hover:bg-primary-600',
            hoverText: 'group-hover:text-white'
        },
        blue: {
            bg: 'bg-blue-100 dark:bg-blue-900/20',
            text: 'text-blue-600 dark:text-blue-400',
            hover: 'group-hover:bg-blue-600',
            hoverText: 'group-hover:text-white'
        },
        green: {
            bg: 'bg-green-100 dark:bg-green-900/20',
            text: 'text-green-600 dark:text-green-400',
            hover: 'group-hover:bg-green-600',
            hoverText: 'group-hover:text-white'
        }
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            {/* Hero Section */}
            <section className="relative overflow-hidden bg-gradient-to-br from-primary-600 via-primary-700 to-primary-900 text-white">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                    <div className="absolute top-20 left-20 w-72 h-72 bg-white rounded-full blur-3xl" />
                    <div className="absolute bottom-20 right-20 w-96 h-96 bg-white rounded-full blur-3xl" />
                </div>

                <div className="container-app relative z-10 py-20 md:py-28">
                    <div className="max-w-3xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
                            Welcome back, {user?.name}! 👋
                        </h1>
                        <p className="text-lg md:text-xl text-primary-100 mb-4 font-bold">
                            Ready to collaborate on your next big project?
                        </p>
                        <p className="text-primary-200 max-w-2xl mx-auto">
                            Whether you're looking for teammates or want to join an exciting team,
                            StackUp is here to help you build something amazing.
                        </p>
                    </div>
                </div>
            </section>

            {/* Quick Actions Section */}
            <section className="py-16">
                <div className="container-app">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            What would you like to do?
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            Get started with one of these quick actions
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {quickActions.map((action, index) => {
                            const colors = colorClasses[action.color];
                            return (
                                <Link key={index} to={action.link}>
                                    <Card className="h-full p-6 hover:shadow-xl transition-all duration-300 group cursor-pointer border-2 hover:border-primary-300">
                                        <div className={`w-14 h-14 ${colors.bg} rounded-xl flex items-center justify-center ${colors.text} mb-4 ${colors.hover} ${colors.hoverText} transition-colors`}>
                                            {action.icon}
                                        </div>
                                        <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2 flex items-center gap-2">
                                            {action.title}
                                            <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transition-opacity" />
                                        </h3>
                                        <p className="text-[var(--color-text-secondary)]">
                                            {action.description}
                                        </p>
                                    </Card>
                                </Link>
                            );
                        })}
                    </div>
                </div>
            </section>

            {/* Activity Overview Section */}
            <section className="py-16 bg-[var(--color-bg-secondary)]">
                <div className="container-app">
                    <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                        {/* Latest Openings */}
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/20 rounded-lg flex items-center justify-center">
                                    <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                    Trending Openings
                                </h3>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Discover the latest team openings from students across colleges.
                            </p>
                            <Link to="/browse">
                                <Button variant="ghost" className="w-full">
                                    Explore Openings
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </Card>

                        {/* Your Teams */}
                        <Card className="p-6">
                            <div className="flex items-center gap-3 mb-4">
                                <div className="w-10 h-10 bg-amber-100 dark:bg-amber-900/20 rounded-lg flex items-center justify-center">
                                    <MessageSquare className="w-5 h-5 text-amber-600 dark:text-amber-400" />
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text-primary)]">
                                    Your Activity
                                </h3>
                            </div>
                            <p className="text-[var(--color-text-secondary)] mb-4">
                                Check your openings, applications, and team collaborations.
                            </p>
                            <Link to="/dashboard">
                                <Button variant="ghost" className="w-full">
                                    View Dashboard
                                    <ArrowRight className="w-4 h-4 ml-2" />
                                </Button>
                            </Link>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Tips Section */}
            <section className="py-16">
                <div className="container-app">
                    <div className="max-w-3xl mx-auto">
                        <Card className="p-8 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 border-primary-200 dark:border-primary-800">
                            <div className="flex items-start gap-4">
                                <div className="w-12 h-12 bg-primary-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <Rocket className="w-6 h-6 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                                        Pro Tips for Success
                                    </h3>
                                    <ul className="space-y-2 text-[var(--color-text-secondary)]">
                                        <li>✨ Write clear descriptions when posting openings</li>
                                        <li>💡 List specific skills you're looking for</li>
                                        <li>🚀 Respond promptly to applications</li>
                                        <li>🤝 Use team chat to stay connected with your team</li>
                                    </ul>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default WelcomePage;
