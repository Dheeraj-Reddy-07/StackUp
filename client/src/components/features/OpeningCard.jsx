// ============================================
// Opening Card Component
// ============================================
// Card display for openings in browse/list views

import { Link } from 'react-router-dom';
import { Users, Calendar, ArrowRight } from 'lucide-react';
import { Card, Badge, SkillTag } from '../ui';

const OpeningCard = ({ opening }) => {
    // Project type badge colors
    const typeColors = {
        hackathon: 'primary',
        project: 'success',
        startup: 'warning',
        study: 'gray'
    };

    // Format date
    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    return (
        <Card hover className="flex flex-col h-full">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <Badge variant={typeColors[opening.projectType]}>
                    {opening.projectType.charAt(0).toUpperCase() + opening.projectType.slice(1)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                    <Users className="w-4 h-4" />
                    <span>{opening.totalSlots - opening.filledSlots} / {opening.totalSlots} slots</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-2 line-clamp-2">
                {opening.title}
            </h3>

            {/* Description */}
            <p className="text-[var(--color-text-secondary)] text-sm mb-4 line-clamp-3 flex-grow">
                {opening.description}
            </p>

            {/* Skills */}
            <div className="flex flex-wrap gap-2 mb-4">
                {opening.requiredSkills?.slice(0, 4).map((skill) => (
                    <SkillTag key={skill} skill={skill} />
                ))}
                {opening.requiredSkills?.length > 4 && (
                    <span className="text-sm text-[var(--color-text-secondary)]">
                        +{opening.requiredSkills.length - 4} more
                    </span>
                )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between pt-4 border-t border-[var(--color-border)]">
                <div className="flex items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                    <Calendar className="w-4 h-4" />
                    <span>{formatDate(opening.createdAt)}</span>
                </div>
                <Link
                    to={`/openings/${opening._id}`}
                    className="flex items-center gap-1 text-primary-600 font-medium text-sm hover:text-primary-700 transition-colors"
                >
                    View Details
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </Card>
    );
};

export default OpeningCard;
