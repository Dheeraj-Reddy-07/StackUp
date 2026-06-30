// ============================================
// Landing Page
// ============================================
// Premium hero page with CTAs and features

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
    MessageSquare,
    Sparkles,
    Star
} from 'lucide-react';
import Button from '../components/ui/Button';
import { enableDemoMode } from '../services/demoData';

const LandingPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Enter demo mode: explore the app with sample data, no login/backend
    const startDemo = () => {
        enableDemoMode();
        window.location.href = '/dashboard';
    };

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
            description: 'Find skilled teammates for hackathons and coding competitions. Build winning projects together.',
            accent: 'from-indigo-500 to-violet-500'
        },
        {
            icon: <Code className="w-6 h-6" />,
            title: 'Project Collaboration',
            description: 'Connect with developers to build side projects, open source contributions, or portfolio pieces.',
            accent: 'from-cyan-500 to-blue-500'
        },
        {
            icon: <Zap className="w-6 h-6" />,
            title: 'Startup Building',
            description: 'Find co-founders and early team members for your startup idea. Build something meaningful.',
            accent: 'from-amber-500 to-orange-500'
        },
        {
            icon: <BookOpen className="w-6 h-6" />,
            title: 'Study Groups',
            description: 'Form study groups for placements, competitive programming, or technical interviews.',
            accent: 'from-emerald-500 to-teal-500'
        }
    ];

    const benefits = [
        'Find teammates with complementary skills',
        'Private team chat for collaboration',
        'Easy application management',
        'Built for engineering students'
    ];

    const stats = [
        { label: 'Active Openings', value: '500+' },
        { label: 'Teams Formed', value: '200+' },
        { label: 'Students', value: '1000+' },
        { label: 'Colleges', value: '50+' }
    ];

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)]">
            {/* ============================== Hero ============================== */}
            <section className="relative overflow-hidden">
                {/* Deep gradient base */}
                <div className="absolute inset-0 bg-gradient-to-br from-[#1e1b4b] via-[#312e81] to-[#0f172a]" />

                {/* Animated aurora wash */}
                <div className="absolute inset-0 opacity-70 animate-aurora bg-[radial-gradient(circle_at_20%_20%,rgba(99,102,241,0.45),transparent_45%),radial-gradient(circle_at_80%_0%,rgba(34,211,238,0.30),transparent_40%),radial-gradient(circle_at_60%_90%,rgba(168,85,247,0.35),transparent_45%)]" />

                {/* Floating glow blobs */}
                <div className="absolute -top-24 -left-24 w-[28rem] h-[28rem] bg-indigo-500/30 rounded-full blur-3xl animate-float" />
                <div className="absolute top-1/3 -right-24 w-[26rem] h-[26rem] bg-cyan-400/20 rounded-full blur-3xl animate-float-slow" />

                {/* Dotted grid texture */}
                <div className="absolute inset-0 bg-grid-dots" />

                {/* Bottom fade into page bg */}
                <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[var(--color-bg-secondary)] to-transparent" />

                <div className="container-app relative z-10 pt-24 pb-28 md:pt-32 md:pb-36 text-white">
                    <div className="max-w-3xl mx-auto text-center">
                        {/* Eyebrow badge */}
                        <div className="animate-slide-up inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-medium mb-7 bg-white/10 border border-white/15 backdrop-blur-md text-indigo-100">
                            <Sparkles className="w-4 h-4 text-cyan-300" />
                            Built for engineering students
                        </div>

                        <h1 className="animate-slide-up !text-white text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-[1.08] tracking-tight" style={{ animationDelay: '0.05s' }}>
                            Build Your Dream Team
                            <span className="block mt-2 bg-gradient-to-r from-indigo-200 via-cyan-200 to-violet-200 bg-clip-text text-transparent">
                                For Any Tech Challenge
                            </span>
                        </h1>

                        <p className="animate-slide-up text-lg md:text-xl text-indigo-100/80 mb-10 max-w-2xl mx-auto leading-relaxed" style={{ animationDelay: '0.12s' }}>
                            StackUp is the collaboration platform for engineering students.
                            Find teammates for hackathons, projects, startups, and study groups.
                        </p>

                        <div className="animate-slide-up flex flex-col sm:flex-row gap-4 justify-center" style={{ animationDelay: '0.18s' }}>
                            <Link to={isAuthenticated ? '/openings/new' : '/signup'}>
                                <Button size="lg" className="w-full sm:w-auto !bg-none !bg-white !text-indigo-700 hover:!bg-indigo-50 shadow-xl shadow-indigo-950/40 font-semibold">
                                    Post an Opening
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                            <Link to="/browse">
                                <Button size="lg" variant="ghost" className="w-full sm:w-auto !text-white border border-white/30 bg-white/10 backdrop-blur-md hover:!bg-white/20 font-semibold">
                                    Browse Openings
                                </Button>
                            </Link>
                        </div>

                        {!isAuthenticated && (
                            <button
                                onClick={startDemo}
                                className="animate-slide-up mt-6 inline-flex items-center gap-1.5 text-indigo-100/90 hover:text-white transition-colors text-sm font-medium group"
                                style={{ animationDelay: '0.24s' }}
                            >
                                <Sparkles className="w-4 h-4 text-cyan-300" />
                                Try the live demo, no sign-up needed
                                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                            </button>
                        )}
                    </div>

                    {/* Floating glass stat strip */}
                    <div className="animate-slide-up mt-20 max-w-4xl mx-auto" style={{ animationDelay: '0.3s' }}>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-px rounded-2xl overflow-hidden bg-white/10 border border-white/15 backdrop-blur-xl shadow-2xl shadow-indigo-950/40">
                            {stats.map((stat) => (
                                <div key={stat.label} className="text-center px-4 py-7 bg-white/5">
                                    <div className="text-3xl md:text-4xl font-bold mb-1 bg-gradient-to-br from-white to-indigo-200 bg-clip-text text-transparent">
                                        {stat.value}
                                    </div>
                                    <div className="text-indigo-200/80 text-xs md:text-sm font-medium">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================== Features ============================== */}
            <section className="py-20 md:py-28">
                <div className="container-app">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="badge badge-primary mb-4">What you can build</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            Everything You Need to Build Great Teams
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            Whether it's a 24-hour hackathon or a semester-long project,
                            StackUp helps you find the right people.
                        </p>
                    </div>

                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div
                                key={index}
                                className="card card-hover group relative"
                            >
                                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-5 bg-gradient-to-br ${feature.accent} shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                                    {feature.icon}
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2">
                                    {feature.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                                    {feature.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================== How It Works ============================== */}
            <section className="py-20 md:py-28 bg-[var(--color-bg-tertiary)] border-y border-[var(--color-border)]">
                <div className="container-app">
                    <div className="text-center max-w-2xl mx-auto mb-16">
                        <span className="badge badge-primary mb-4">Simple process</span>
                        <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-4">
                            How StackUp Works
                        </h2>
                        <p className="text-[var(--color-text-secondary)] text-lg">
                            Three simple steps to build your dream team
                        </p>
                    </div>

                    <div className="relative grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {/* Connector line behind the cards (desktop) */}
                        <div className="hidden md:block absolute top-16 left-[16%] right-[16%] h-px step-connector" />

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
                            <div key={index} className="relative text-center px-2">
                                <div className="relative z-10 mx-auto mb-6 w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold text-white bg-gradient-to-br from-primary-600 to-primary-500 shadow-lg shadow-primary-600/30">
                                    {item.step}
                                </div>
                                <h3 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">
                                    {item.title}
                                </h3>
                                <p className="text-[var(--color-text-secondary)] leading-relaxed">
                                    {item.description}
                                </p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* ============================== Benefits ============================== */}
            <section className="py-20 md:py-28">
                <div className="container-app">
                    <div className="grid md:grid-cols-2 gap-12 lg:gap-16 items-center">
                        <div>
                            <span className="badge badge-primary mb-4">Why StackUp</span>
                            <h2 className="text-3xl md:text-4xl font-bold text-[var(--color-text-primary)] mb-6">
                                Why Students Choose StackUp
                            </h2>
                            <p className="text-[var(--color-text-secondary)] text-lg mb-8 leading-relaxed">
                                Built specifically for engineering students, StackUp focuses on
                                what matters: finding the right teammates efficiently.
                            </p>
                            <ul className="space-y-4">
                                {benefits.map((benefit, index) => (
                                    <li key={index} className="flex items-center gap-3">
                                        <span className="flex-shrink-0 w-6 h-6 rounded-full bg-[rgba(16,185,129,0.12)] flex items-center justify-center">
                                            <CheckCircle className="w-4 h-4 text-success" />
                                        </span>
                                        <span className="text-[var(--color-text-primary)]">{benefit}</span>
                                    </li>
                                ))}
                            </ul>
                            <div className="mt-9">
                                <Link to={isAuthenticated ? '/browse' : '/signup'}>
                                    <Button size="lg">
                                        Get Started Free
                                        <ArrowRight className="w-5 h-5 ml-2" />
                                    </Button>
                                </Link>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 sm:gap-5">
                            {[
                                { icon: <Users className="w-7 h-7" />, label: 'Teams', sub: 'Form perfect teams', accent: 'from-indigo-500 to-violet-500', tint: 'rgba(99,102,241,0.10)' },
                                { icon: <MessageSquare className="w-7 h-7" />, label: 'Chat', sub: 'Real-time messaging', accent: 'from-emerald-500 to-teal-500', tint: 'rgba(16,185,129,0.10)' },
                                { icon: <Shield className="w-7 h-7" />, label: 'Privacy', sub: 'Team-only access', accent: 'from-amber-500 to-orange-500', tint: 'rgba(245,158,11,0.10)' },
                                { icon: <Zap className="w-7 h-7" />, label: 'Fast', sub: 'Quick matching', accent: 'from-cyan-500 to-blue-500', tint: 'rgba(34,211,238,0.10)' }
                            ].map((box, i) => (
                                <div
                                    key={box.label}
                                    className="rounded-2xl p-6 border border-[var(--color-border)] bg-[var(--color-bg-primary)] shadow-card hover:shadow-elevated hover:-translate-y-1 transition-all duration-300"
                                    style={{ marginTop: i % 2 === 1 ? '1.5rem' : 0 }}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-white mb-4 bg-gradient-to-br ${box.accent} shadow-md`}>
                                        {box.icon}
                                    </div>
                                    <div className="text-xl font-bold text-[var(--color-text-primary)]">{box.label}</div>
                                    <p className="text-[var(--color-text-secondary)] text-sm">{box.sub}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* ============================== CTA ============================== */}
            <section className="py-20 md:py-24">
                <div className="container-app">
                    <div className="relative overflow-hidden rounded-3xl px-6 py-16 md:py-20 text-center text-white bg-gradient-to-br from-[#312e81] via-[#4f46e5] to-[#7c3aed] shadow-2xl shadow-indigo-900/30">
                        {/* Texture + glow */}
                        <div className="absolute inset-0 bg-grid-dots opacity-60" />
                        <div className="absolute -top-20 -right-16 w-72 h-72 bg-cyan-400/20 rounded-full blur-3xl animate-float-slow" />
                        <div className="absolute -bottom-24 -left-16 w-80 h-80 bg-violet-500/30 rounded-full blur-3xl animate-float" />

                        <div className="relative z-10 max-w-2xl mx-auto">
                            <div className="inline-flex items-center gap-1.5 mb-5">
                                {[...Array(5)].map((_, i) => (
                                    <Star key={i} className="w-4 h-4 fill-amber-300 text-amber-300" />
                                ))}
                                <span className="ml-2 text-sm text-indigo-100">Loved by student builders</span>
                            </div>
                            <h2 className="text-3xl md:text-4xl font-bold mb-4">
                                Ready to Build Something Amazing?
                            </h2>
                            <p className="text-indigo-100/85 text-lg mb-9 max-w-xl mx-auto leading-relaxed">
                                Join thousands of engineering students who are collaborating on
                                hackathons, projects, and startups.
                            </p>
                            <Link to={isAuthenticated ? '/browse' : '/signup'}>
                                <Button size="lg" className="!bg-none !bg-white !text-indigo-700 hover:!bg-indigo-50 shadow-xl shadow-indigo-950/30 font-semibold">
                                    Get Started Now
                                    <ArrowRight className="w-5 h-5 ml-2" />
                                </Button>
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default LandingPage;
