import { useState, useMemo, createContext, useContext } from 'react';
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { lightTheme, darkTheme } from './theme';
import { WalletProvider, useWallet } from './context/WalletContext';
import CsvImporter from './components/import/CsvImporter';
import AppHeader from './components/layout/AppHeader';
import DashboardLayout from './components/layout/DashboardLayout';
import PredictionsLayout from './components/predictions/PredictionsLayout';
import Sidebar from './components/layout/Sidebar';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Alert from '@mui/material/Alert';
import type { ColorModeContextValue } from './types';

const ColorModeContext = createContext<ColorModeContextValue>({ mode: 'light', toggleMode: () => {} });
export const useColorMode = () => useContext(ColorModeContext);

type Page = 'dashboard' | 'predictions';

function AppContent() {
  const { rawTransactions, isLoading, error } = useWallet();
  const [activePage, setActivePage] = useState<Page>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress size={60} />
      </Box>
    );
  }

  if (error) {
    return (
      <Box p={3}>
        <Alert severity="error">{error}</Alert>
      </Box>
    );
  }

  if (rawTransactions.length === 0) {
    return <CsvImporter />;
  }

  return (
    <>
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        activePage={activePage}
        onNavigate={(page) => setActivePage(page as Page)}
      />
      <AppHeader onMenuClick={() => setSidebarOpen(true)} />
      {activePage === 'dashboard' && <DashboardLayout />}
      {activePage === 'predictions' && <PredictionsLayout />}
    </>
  );
}

export default function App() {
  const [mode, setMode] = useState<'light' | 'dark'>('light');
  const colorMode = useMemo(() => ({
    mode,
    toggleMode: () => setMode((prev) => (prev === 'light' ? 'dark' : 'light')),
  }), [mode]);

  const theme = mode === 'light' ? lightTheme : darkTheme;

  return (
    <ColorModeContext.Provider value={colorMode}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <WalletProvider>
          <AppContent />
        </WalletProvider>
      </ThemeProvider>
    </ColorModeContext.Provider>
  );
}
