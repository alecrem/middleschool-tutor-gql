import { Link } from '@remix-run/react';
import { type LucideIcon, Search, CheckCircle } from 'lucide-react';
import { useHydratedTranslation } from '../hooks/useHydratedTranslation';
import { useThemedStyles } from '../hooks/useTheme';
import { Icon } from './Icon';

interface NavigationItem {
  path: string;
  labelKey: string;
  icon: LucideIcon;
}

interface NavigationProps {
  currentPath: string;
}

const navigationItems: NavigationItem[] = [
  {
    path: '/',
    labelKey: 'searchCards',
    icon: Search,
  },
  {
    path: '/deck-check',
    labelKey: 'deckCheck',
    icon: CheckCircle,
  },
];

export function Navigation({ currentPath }: NavigationProps) {
  const { t } = useHydratedTranslation();
  const { colors, utilities } = useThemedStyles();

  const getItemStyles = (isActive: boolean) => ({
    display: 'flex',
    alignItems: 'center',
    gap: utilities.spacing('sm'),
    padding: `${utilities.spacing('md')} ${utilities.spacing('lg')}`,
    textDecoration: 'none',
    fontSize: utilities.fontSize('base'),
    fontWeight: isActive ? '600' : '500',
    color: isActive ? colors.text.primary : colors.text.secondary,
    backgroundColor: 'transparent',
    borderBottom: `2px solid ${isActive ? colors.text.primary : 'transparent'}`,
    transition: utilities.transition('all'),
    cursor: 'pointer',
    position: 'relative' as const,
  });

  const getHoverStyles = (isActive: boolean) => ({
    color: colors.text.primary,
    borderBottomColor: isActive ? colors.text.primary : colors.text.secondary,
  });

  return (
    <nav
      aria-label={t('mainNavigation')}
      style={{
        display: 'flex',
        gap: utilities.spacing('md'),
        marginBottom: utilities.spacing('xl'),
        padding: `${utilities.spacing('sm')} 0`,
      }}
    >
      {navigationItems.map((item) => {
        const isActive = currentPath === item.path;
        const itemStyles = getItemStyles(isActive);

        return (
          <Link
            key={item.path}
            to={item.path}
            style={itemStyles}
            onMouseEnter={(e) => {
              if (!isActive) {
                Object.assign(e.currentTarget.style, getHoverStyles(false));
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                Object.assign(e.currentTarget.style, getItemStyles(false));
              }
            }}
            aria-current={isActive ? 'page' : undefined}
          >
            <Icon icon={item.icon} size="sm" />
            <span>{t(item.labelKey)}</span>
          </Link>
        );
      })}
    </nav>
  );
}