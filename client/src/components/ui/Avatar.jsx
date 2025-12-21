// ============================================
// Avatar Component
// ============================================
// User avatar with initials fallback

const Avatar = ({
    name = '',
    imageUrl,
    size = 'md',
    className = ''
}) => {
    // Get initials from name
    const getInitials = (name) => {
        return name
            .split(' ')
            .map(word => word[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const sizes = {
        sm: 'avatar-sm',
        md: 'avatar-md',
        lg: 'avatar-lg'
    };

    if (imageUrl) {
        return (
            <img
                src={imageUrl}
                alt={name}
                className={`rounded-full object-cover ${sizes[size]} ${className}`}
            />
        );
    }

    return (
        <div className={`avatar ${sizes[size]} ${className}`}>
            {getInitials(name) || '?'}
        </div>
    );
};

export default Avatar;
