import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import DashboardIcon from '@mui/icons-material/Dashboard';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';

const NAV_ITEMS = [
  { key: 'dashboard', label: 'Dashboard', icon: DashboardIcon },
  { key: 'predictions', label: 'Predictions', icon: TrendingUpIcon },
];

const DRAWER_WIDTH = 240;

export default function Sidebar({ open, onClose, activePage, onNavigate }) {
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  return (
    <Drawer
      open={open}
      onClose={onClose}
      sx={{
        '& .MuiDrawer-paper': {
          width: DRAWER_WIDTH,
          background: dark
            ? 'linear-gradient(180deg, #0f172a 0%, #1a1040 100%)'
            : 'linear-gradient(180deg, #f8fafc 0%, #ede9fe 100%)',
          borderRight: dark
            ? '1px solid rgba(255,255,255,0.06)'
            : '1px solid rgba(0,0,0,0.06)',
        },
      }}
    >
      <Box sx={{ p: 2.5, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <AccountBalanceWalletIcon sx={{ color: 'primary.main', fontSize: 28 }} />
        <Typography variant="h6" fontWeight={700} color="primary.main">
          MyWallet
        </Typography>
      </Box>

      <List sx={{ px: 1.5 }}>
        {NAV_ITEMS.map(({ key, label, icon: Icon }) => (
          <ListItemButton
            key={key}
            selected={activePage === key}
            onClick={() => { onNavigate(key); onClose(); }}
            sx={{
              borderRadius: 3,
              mb: 0.5,
              '&.Mui-selected': {
                bgcolor: dark ? 'rgba(129,140,248,0.15)' : 'rgba(99,102,241,0.1)',
                color: 'primary.main',
                '&:hover': { bgcolor: dark ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.15)' },
                '& .MuiListItemIcon-root': { color: 'primary.main' },
              },
            }}
          >
            <ListItemIcon sx={{ minWidth: 40 }}>
              <Icon fontSize="small" />
            </ListItemIcon>
            <ListItemText
              primary={label}
              primaryTypographyProps={{ fontWeight: 600, fontSize: 14 }}
            />
          </ListItemButton>
        ))}
      </List>
    </Drawer>
  );
}
