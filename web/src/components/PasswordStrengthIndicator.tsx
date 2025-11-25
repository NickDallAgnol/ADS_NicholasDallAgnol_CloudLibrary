import { useMemo } from 'react';

interface PasswordStrengthIndicatorProps {
  password: string;
}

export function PasswordStrengthIndicator({ password }: PasswordStrengthIndicatorProps) {
  const strength = useMemo(() => {
    if (!password) return { level: 0, label: '', color: '' };

    let score = 0;
    
    // Critérios de força
    if (password.length >= 6) score++;
    if (password.length >= 10) score++;
    if (/[a-z]/.test(password)) score++;
    if (/[A-Z]/.test(password)) score++;
    if (/\d/.test(password)) score++;
    if (/[@$!%*#?&]/.test(password)) score++;

    if (score <= 2) return { level: 1, label: 'Fraca', color: 'bg-red-500' };
    if (score <= 4) return { level: 2, label: 'Média', color: 'bg-yellow-500' };
    return { level: 3, label: 'Forte', color: 'bg-green-500' };
  }, [password]);

  if (!password) return null;

  return (
    <div className="mt-2">
      <div className="flex gap-1 mb-1">
        {[1, 2, 3].map((level) => (
          <div
            key={level}
            className={`h-1 flex-1 rounded-full transition-all ${
              level <= strength.level ? strength.color : 'bg-gray-200'
            }`}
          />
        ))}
      </div>
      <p className={`text-xs font-medium ${
        strength.level === 1 ? 'text-red-600' :
        strength.level === 2 ? 'text-yellow-600' :
        'text-green-600'
      }`}>
        Senha {strength.label}
      </p>
    </div>
  );
}

