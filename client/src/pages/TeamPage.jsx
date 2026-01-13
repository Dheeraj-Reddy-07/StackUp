// ============================================
// Team Page
// ============================================
// View team details and members

import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Users, MessageSquare, ExternalLink } from 'lucide-react';
import { Card, Spinner, Badge, Avatar, Button, SkillTag } from '../components/ui';
import { getTeam } from '../services/teamService';
import toast from 'react-hot-toast';

const TeamPage = () => {
    const { id } = useParams();
    const [team, setTeam] = useState(null);
    const [loading, setLoading] = useState(true);

    const typeColors = {
        hackathon: 'primary',
        project: 'success',
        startup: 'warning',
        study: 'gray'
    };

    useEffect(() => {
        fetchTeam();
    }, [id]);

    const fetchTeam = async () => {
        try {
            const response = await getTeam(id);
            setTeam(response.data);
        } catch (error) {
            toast.error('Failed to load team');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        );
    }

    if (!team) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Card className="text-center py-12 px-8">
                    <h2 className="text-xl font-semibold text-[var(--color-text-primary)] mb-2">Team not found</h2>
                    <p className="text-[var(--color-text-secondary)] mb-4">You may not have access to this team</p>
                    <Link to="/dashboard">
                        <Button>Go to Dashboard</Button>
                    </Link>
                </Card>
            </div>
        );
    }

    const allMembers = [team.owner, ...team.members];
    const opening = team.opening;

    return (
        <div className="min-h-screen bg-[var(--color-bg-secondary)] py-8">
            <div className="container-app max-w-4xl">
                {/* Back Link */}
                <Link
                    to="/dashboard?tab=teams"
                    className="inline-flex items-center gap-2 text-[var(--color-text-secondary)] hover:text-[var(--color-text-primary)] mb-6"
                >
                    <ArrowLeft className="w-4 h-4" />
                    Back to Teams
                </Link>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2">
                        {/* Team Header */}
                        <Card className="mb-6">
                            <div className="flex items-start justify-between mb-4">
                                <Badge variant={typeColors[opening?.projectType || 'project']}>
                                    {(opening?.projectType || 'Project').charAt(0).toUpperCase() +
                                        (opening?.projectType || 'project').slice(1)}
                                </Badge>
                                <div className="flex items-center gap-1 text-sm text-[var(--color-text-secondary)]">
                                    <Users className="w-4 h-4" />
                                    {allMembers.length} members
                                </div>
                            </div>

                            <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-4">
                                {opening?.title || 'Team'}
                            </h1>

                            {opening?.description && (
                                <p className="text-[var(--color-text-secondary)] mb-6">{opening.description}</p>
                            )}

                            {opening?.requiredSkills?.length > 0 && (
                                <div className="flex flex-wrap gap-2">
                                    {opening.requiredSkills.map((skill) => (
                                        <SkillTag key={skill} skill={skill} />
                                    ))}
                                </div>
                            )}
                        </Card>

                        {/* Team Members */}
                        <Card>
                            <h2 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Team Members</h2>
                            <div className="space-y-4">
                                {allMembers.map((member, index) => (
                                    <div
                                        key={member?.id || index}
                                        className="flex items-center gap-4 p-4 bg-[var(--color-bg-tertiary)] rounded-xl"
                                    >
                                        <Avatar name={member?.name} size="lg" />
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2">
                                                <h4 className="font-semibold text-[var(--color-text-primary)]">{member?.name}</h4>
                                                {member?.id === team.owner.id && (
                                                    <Badge variant="primary">Owner</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-[var(--color-text-secondary)]">{member?.email}</p>
                                            {member?.college && (
                                                <p className="text-sm text-[var(--color-text-secondary)]">{member.college}</p>
                                            )}
                                        </div>
                                        {member?.skills?.length > 0 && (
                                            <div className="hidden md:flex gap-2">
                                                {member.skills.slice(0, 3).map((skill) => (
                                                    <SkillTag key={skill} skill={skill} />
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </Card>
                    </div>

                    {/* Sidebar */}
                    <div className="lg:col-span-1">
                        {/* Chat Access */}
                        <Card className="mb-6">
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Team Chat</h3>
                            <p className="text-sm text-[var(--color-text-secondary)] mb-4">
                                Collaborate with your team in real-time
                            </p>
                            <Link to={`/teams/${id}/chat`}>
                                <Button className="w-full">
                                    <MessageSquare className="w-5 h-5" />
                                    Open Chat
                                </Button>
                            </Link>
                        </Card>

                        {/* Team Stats */}
                        <Card>
                            <h3 className="text-lg font-semibold text-[var(--color-text-primary)] mb-4">Team Info</h3>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-text-secondary)]">Type</span>
                                    <span className="font-medium text-[var(--color-text-primary)]">
                                        {(opening?.projectType || 'Project').charAt(0).toUpperCase() +
                                            (opening?.projectType || 'project').slice(1)}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-text-secondary)]">Members</span>
                                    <span className="font-medium text-[var(--color-text-primary)]">
                                        {allMembers.length} / {opening?.totalSlots || allMembers.length}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-[var(--color-text-secondary)]">Formed</span>
                                    <span className="font-medium text-[var(--color-text-primary)]">
                                        {new Date(team.createdAt).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamPage;
