// ============================================
// SkillTag Component
// ============================================
// Tag for displaying skills

import { X } from 'lucide-react';

const SkillTag = ({
    skill,
    onRemove,
    removable = false,
    className = ''
}) => {
    return (
        <span className={`skill-tag ${className}`}>
            {skill}
            {removable && onRemove && (
                <button
                    type="button"
                    onClick={() => onRemove(skill)}
                    className="ml-1 hover:text-primary-900"
                >
                    <X className="w-3 h-3" />
                </button>
            )}
        </span>
    );
};

export default SkillTag;
