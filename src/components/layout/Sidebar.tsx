import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import type { SvgIconComponent } from '@mui/icons-material';
import type { SidebarProps } from '../../types';

interface NavItem {
  key: string;
  label: string;
  icon: SvgIconComponent;
}

const NAV_ITEMS: NavItem[] = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { key: 'predictions', label: 'Predictions', icon: TrendingUpIcon },
];

const DRAWER_WIDTH = 240;

const StyledDrawer = styled(Drawer)(({ theme }) => ({
  '& .MuiDrawer-paper': {
    width: DRAWER_WIDTH,
    background: theme.palette.mode === 'dark'
      ? 'linear-gradient(180deg, #0f172a 0%, #1a1040 100%)'
      : 'linear-gradient(180deg, #f8fafc 0%, #ede9fe 100%)',
    borderRight: theme.palette.mode === 'dark'
      ? '1px solid rgba(255,255,255,0.06)'
      : '1px solid rgba(0,0,0,0.06)',
  },
}));

const BrandBox = styled(Box)({
  padding: 20,
  display: 'flex',
  alignItems: 'center',
  gap: 12,
});

const NavItemButton = styled(ListItemButton)(({ theme }) => ({
  borderRadius: 12,
  marginBottom: 4,
  '&.Mui-selected': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.1)',
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.15)',
    },
    '& .MuiListItemIcon-root': { color: theme.palette.primary.main },
  },
}));

export default function Sidebar({ open, onClose, activePage, onNavigate }: SidebarProps) {
  return (
    <StyledDrawer open={open} onClose={onClose}>
      <BrandBox>
        <AccountBalanceWalletIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="primary.main">
          MyWallet
        </Typography>
      </BrandBox>

      <List sx={{ px: 1.5 }}>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <NavItemButton
            key={key}
            selected={activePage === key}
            onClick={() => { onNavigate(key); onClose(); }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
            />
          </NavItemButton>
        ))}
      </List>
    </StyledDrawer>
  );
}
