import { Link } from '@remix-run/react';
import { LucideIcon, Search, CheckCircle } from 'lucide-react';
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
    borderRadius: utilities.borderRadius('md'),
    textDecoration: 'none',
    fontSize: utilities.fontSize('base'),
    fontWeight: isActive ? '600' : '500',
    color: isActive ? colors.text.primary : colors.text.secondary,
    backgroundColor: isActive ? colors.background.secondary : 'transparent',
    border: `1px solid ${isActive ? colors.border.primary : 'transparent'}`,
    transition: utilities.transition('all'),
    cursor: 'pointer',
  });

  const getHoverStyles = (isActive: boolean) => ({
    color: colors.text.primary,
    backgroundColor: isActive ? colors.background.secondary : colors.background.secondary,
    borderColor: colors.border.primary,
  });

  return (
    <nav
      role="navigation"
      aria-label={t('mainNavigation')}
      style={{
        display: 'flex',
        gap: utilities.spacing('sm'),
        marginBottom: utilities.spacing('xl'),
        padding: `${utilities.spacing('md')} 0`,
        borderBottom: `1px solid ${colors.border.primary}`,
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