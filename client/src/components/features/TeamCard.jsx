// ============================================
// Team Card Component
// ============================================
// Display for teams in dashboard

import { Link } from 'react-router-dom';
import { Users, MessageSquare, ArrowRight } from 'lucide-react';
import { Card, Badge, Avatar } from '../ui';

const TeamCard = ({ team }) => {
    // Project type badge colors
    const typeColors = {
        hackathon: 'primary',
        project: 'success',
        startup: 'warning',
        study: 'gray'
    };

    const opening = team.opening;
    const allMembers = [team.owner, ...team.members];

    return (
        <Card hover className="flex flex-col">
            {/* Header */}
            <div className="flex items-start justify-between mb-3">
                <Badge variant={typeColors[opening?.projectType || 'project']}>
                    {(opening?.projectType || 'Project').charAt(0).toUpperCase() +
                        (opening?.projectType || 'project').slice(1)}
                </Badge>
                <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                    <Users className="w-4 h-4" />
                    <span>{allMembers.length} members</span>
                </div>
            </div>

            {/* Title */}
            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">
                {opening?.title || 'Team'}
            </h3>

            {/* Members */}
            <div className="flex -space-x-2 mb-4">
                {allMembers.slice(0, 5).map((member, index) => (
                    <Avatar
                        key={member?._id || index}
                        name={member?.name}
                        size="sm"
                        className="ring-2 ring-[var(--color-bg-primary)]"
                    />
                ))}
                {allMembers.length > 5 && (
                    <div className="w-8 h-8 rounded-full bg-[var(--color-bg-tertiary)] flex items-center justify-center text-xs font-medium text-[var(--color-text-secondary)] ring-2 ring-[var(--color-bg-primary)]">
                        +{allMembers.length - 5}
                    </div>
                )}
            </div>

            {/* Actions */}
            <div className="pt-4 border-t border-[var(--color-border)]">
                <Link
                    to={`/teams/${team._id}`}
                    className="flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-primary-600 rounded-lg hover:bg-primary-700 transition-colors w-full"
                >
                    View Team
                    <ArrowRight className="w-4 h-4" />
                </Link>
            </div>
        </Card>
    );
};

export default TeamCard;
