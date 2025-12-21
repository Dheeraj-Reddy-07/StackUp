// ============================================
// Badge Component
// ============================================
// Status/category badges

const Badge = ({
    children,
    variant = 'primary',
    className = ''
}) => {
    const variants = {
        primary: 'badge-primary',
        success: 'badge-success',
        warning: 'badge-warning',
        error: 'badge-error',
        gray: 'badge-gray'
    };

    return (
        <span className={`${variants[variant]} ${className}`}>
            {children}
        </span>
    );
};

export default Badge;
