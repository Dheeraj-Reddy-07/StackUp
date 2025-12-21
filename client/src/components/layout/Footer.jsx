// ============================================
// Footer Component
// ============================================
// Site footer with links

import { Link } from 'react-router-dom';
import { Layers, Github, Twitter, Linkedin } from 'lucide-react';

const Footer = () => {
    return (
        <footer className="bg-[var(--color-bg-tertiary)] border-t border-[var(--color-border)] transition-colors">
            <div className="container-app py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand */}
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                                <Layers className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold text-[var(--color-text-primary)]">StackUp</span>
                        </div>
                        <p className="text-[var(--color-text-secondary)] max-w-md">
                            The collaboration platform for engineering students.
                            Find teammates for hackathons, projects, startups, and study groups.
                        </p>
                        <div className="flex gap-4 mt-6">
                            <a
                                href="https://github.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                            >
                                <Github className="w-5 h-5" />
                            </a>
                            <a
                                href="https://twitter.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                            >
                                <Twitter className="w-5 h-5" />
                            </a>
                            <a
                                href="https://linkedin.com"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="p-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] hover:bg-[var(--color-bg-secondary)] rounded-lg transition-colors"
                            >
                                <Linkedin className="w-5 h-5" />
                            </a>
                        </div>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="text-[var(--color-text-primary)] font-semibold mb-4">Platform</h4>
                        <ul className="space-y-2">
                            <li>
                                <Link to="/browse" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Browse Openings
                                </Link>
                            </li>
                            <li>
                                <Link to="/openings/new" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Post an Opening
                                </Link>
                            </li>
                            <li>
                                <Link to="/dashboard" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Dashboard
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="text-[var(--color-text-primary)] font-semibold mb-4">Support</h4>
                        <ul className="space-y-2">
                            <li>
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Help Center
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Contact Us
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Privacy Policy
                                </a>
                            </li>
                            <li>
                                <a href="#" className="text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] transition-colors">
                                    Terms of Service
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-[var(--color-border)] mt-12 pt-8 text-center text-[var(--color-text-tertiary)]">
                    <p>&copy; {new Date().getFullYear()} StackUp. Built for students, by students.</p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
