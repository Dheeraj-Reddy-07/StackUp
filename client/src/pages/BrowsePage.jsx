// ============================================
// Browse Openings Page
// ============================================
// List all openings with filters

import { useState, useEffect, useRef } from 'react';
import { Search, Filter, X } from 'lucide-react';
import { Card, Spinner, Button } from '../components/ui';
import { OpeningCard } from '../components/features';
import { getOpenings } from '../services/openingService';
import toast from 'react-hot-toast';

const BrowsePage = () => {
    const [openings, setOpenings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState('');
    const [projectType, setProjectType] = useState('');
    const searchTimeoutRef = useRef(null);

    const projectTypes = [
        { value: '', label: 'All Types' },
        { value: 'hackathon', label: 'Hackathon' },
        { value: 'project', label: 'Project' },
        { value: 'startup', label: 'Startup' },
        { value: 'study', label: 'Study Group' }
    ];

    const fetchOpenings = async (searchTerm = search, type = projectType) => {
        setLoading(true);
        try {
            const response = await getOpenings({
                projectType: type || undefined,
                search: searchTerm || undefined,
                status: 'open'
            });
            setOpenings(response.data);
        } catch (error) {
            toast.error('Failed to load openings');
        } finally {
            setLoading(false);
        }
    };

    // Initial load and when projectType changes
    useEffect(() => {
        fetchOpenings(search, projectType);
    }, [projectType]);

    // Debounced search effect
    useEffect(() => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            fetchOpenings(search, projectType);
        }, 500);

        return () => {
            if (searchTimeoutRef.current) {
                clearTimeout(searchTimeoutRef.current);
            }
        };
    }, [search]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }
        fetchOpenings(search, projectType);
    };

    const clearFilters = () => {
        setSearch('');
        setProjectType('');
    };

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8 transition-colors">
            <div className="container-app">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-3xl font-bold text-[var(--color-text-primary)] mb-2">
                        Browse Openings
                    </h1>
                    <p className="text-[var(--color-text-secondary)]">
                        Find the perfect team to join
                    </p>
                </div>

                {/* Search and Filters */}
                <Card className="mb-8">
                    <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-3 items-end">
                        {/* Search Input - Main, longer */}
                        <div className="flex-1 w-full relative">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-[var(--color-text-tertiary)] pointer-events-none z-10" />
                            <input
                                type="text"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search openings by title, description, or skills..."
                                className="input"
                                style={{ paddingLeft: '3rem' }}
                            />
                        </div>

                        {/* Project Type Filter - Smaller, on right */}
                        <div className="w-full md:w-auto">
                            <select
                                value={projectType}
                                onChange={(e) => setProjectType(e.target.value)}
                                className="input w-full md:w-40 text-sm"
                            >
                                {projectTypes.map((type) => (
                                    <option key={type.value} value={type.value}>
                                        {type.label}
                                    </option>
                                ))}
                            </select>
                        </div>

                        {(search || projectType) && (
                            <Button type="button" variant="ghost" onClick={clearFilters} className="whitespace-nowrap">
                                <X className="w-4 h-4" />
                                Clear
                            </Button>
                        )}
                    </form>
                </Card>

                {/* Results */}
                {loading ? (
                    <div className="flex justify-center py-20">
                        <Spinner size="lg" />
                    </div>
                ) : openings.length === 0 ? (
                    <Card className="text-center py-12">
                        <Search className="w-12 h-12 text-[var(--color-text-tertiary)] mx-auto mb-4" />
                        <h3 className="text-lg font-medium text-[var(--color-text-primary)] mb-2">No openings found</h3>
                        <p className="text-[var(--color-text-secondary)]">Try adjusting your search or filters</p>
                    </Card>
                ) : (
                    <div>
                        <p className="text-[var(--color-text-secondary)] mb-6">
                            {openings.length} opening{openings.length !== 1 ? 's' : ''} found
                        </p>
                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                            {openings.map((opening) => (
                                <OpeningCard key={opening.id} opening={opening} />
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default BrowsePage;
