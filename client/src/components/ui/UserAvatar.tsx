interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImageUrl?: string;
}

interface UserAvatarProps {
  user: User;
  size?: 'sm' | 'md' | 'lg';
}

export function UserAvatar({ user, size = 'md' }: UserAvatarProps) {
  const sizeClasses = {
    sm: 'h-8 w-8 text-sm',
    md: 'h-12 w-12 text-base',
    lg: 'h-16 w-16 text-lg'
  };

  const initials = `${user.firstName?.[0] || ''}${user.lastName?.[0] || ''}`.toUpperCase();

  if (user.profileImageUrl) {
    return (
      <img
        className={`${sizeClasses[size]} rounded-full object-cover`}
        src={user.profileImageUrl}
        alt={`${user.firstName} ${user.lastName}`}
      />
    );
  }

  return (
    <div className={`${sizeClasses[size]} rounded-full bg-gray-500 flex items-center justify-center text-white font-medium`}>
      {initials}
    </div>
  );
}