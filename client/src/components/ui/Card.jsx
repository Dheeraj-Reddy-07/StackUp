// ============================================
// Card Component
// ============================================
// Reusable card container

const Card = ({
    children,
    className = '',
    hover = false,
    padding = true,
    ...props
}) => {
    return (
        <div
            className={`card ${hover ? 'card-hover' : ''} ${padding ? 'p-6' : ''} ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export default Card;
