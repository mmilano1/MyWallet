import { useMemo } from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import Typography from '@mui/material/Typography';
import { styled, useTheme } from '@mui/material/styles';
import AccountBalanceWalletIcon from '@mui/icons-material/AccountBalanceWallet';
import FileUploadIcon from '@mui/icons-material/FileUpload';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import LightModeIcon from '@mui/icons-material/LightMode';
import { useWallet, useWalletAnalytics } from '../../context/WalletContext';
import { useColorMode } from '../../App';
import { formatMonthYear } from '../../utils/formatters';
import type { AppHeaderProps } from '../../types';

const StyledAppBar = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(15,23,42,0.85)' : 'rgba(255,255,255,0.82)',
  backdropFilter: 'blur(16px)',
  borderBottom: theme.palette.mode === 'dark' ? '1px solid rgba(255,255,255,0.06)' : '1px solid rgba(0,0,0,0.06)',
  color: theme.palette.text.primary,
}));

const StyledToolbar = styled(Toolbar)({
  gap: 12,
  flexWrap: 'wrap',
  paddingTop: 8,
  paddingBottom: 8,
  minHeight: 'auto !important',
});

const MenuButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  '&:hover': { backgroundColor: theme.palette.action.hover },
}));

const ThemeToggleButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': { color: theme.palette.primary.main, backgroundColor: theme.palette.action.hover },
}));

const UploadButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.primary.main,
  backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.12)' : 'rgba(99,102,241,0.08)',
  '&:hover': {
    backgroundColor: theme.palette.mode === 'dark' ? 'rgba(129,140,248,0.2)' : 'rgba(99,102,241,0.15)',
  },
}));

const CategoryPctLabel = styled(Typography)({
  marginLeft: 8,
  fontWeight: 600,
});

export default function AppHeader({ onMenuClick }: AppHeaderProps) {
  const {
    filters,
    clearData,
    setPeriodMode,
    setYear,
    setMonth,
    setCategoryFilter,
    setAccountFilter,
    setExcludeCategories,
  } = useWallet();
  const { availableYears, availableMonths, availableCategories, availableAccounts, categoryData } =
    useWalletAnalytics();
  const { mode, toggleMode } = useColorMode();
  const theme = useTheme();
  const dark = theme.palette.mode === 'dark';

  const categoryPct = useMemo(() => {
    const total = categoryData.reduce((s, c) => s + c.amount, 0);
    const map: Record<string, string> = {};
    for (const c of categoryData) {
      map[c.category] = total > 0 ? ((c.amount / total) * 100).toFixed(1) : '0.0';
    }
    return map;
  }, [categoryData]);

  const sortedCategories = useMemo(() =>
    [...availableCategories].sort((a, b) => (parseFloat(categoryPct[b] || '0')) - (parseFloat(categoryPct[a] || '0'))),
    [availableCategories, categoryPct]
  );

  const renderCategoryOption = (props: React.HTMLAttributes<HTMLLIElement>, option: string) => (
    <Box component="li" {...props} display="flex" justifyContent="space-between" key={option}>
      <span>{option}</span>
      {categoryPct[option] && (
        <CategoryPctLabel variant="caption" color="text.secondary">
          {categoryPct[option]}%
        </CategoryPctLabel>
      )}
    </Box>
  );

  return (
    <StyledAppBar position="sticky" elevation={0}>
      <StyledToolbar>
        <MenuButton onClick={onMenuClick} size="small">
          <AccountBalanceWalletIcon sx={{ fontSize: 24 }} />
        </MenuButton>

        <ToggleButtonGroup
          value={filters.periodMode}
          exclusive
          onChange={(_, v) => v && setPeriodMode(v)}
          size="small"
        >
          <ToggleButton value="monthly">Monthly</ToggleButton>
          <ToggleButton value="yearly">Yearly</ToggleButton>
        </ToggleButtonGroup>

        <FormControl size="small" sx={{ minWidth: 100 }}>
          <InputLabel>Year</InputLabel>
          <Select
            value={filters.selectedYear ?? ''}
            label="Year"
            onChange={(e: SelectChangeEvent<number | string>) => setYear(e.target.value === '' ? null : Number(e.target.value))}
          >
            <MenuItem value="">All</MenuItem>
            {availableYears.map((y) => (
              <MenuItem key={y} value={y}>{y}</MenuItem>
            ))}
          </Select>
        </FormControl>

        {filters.periodMode === 'monthly' && filters.selectedYear && (
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Month</InputLabel>
            <Select
              value={filters.selectedMonth || ''}
              label="Month"
              onChange={(e: SelectChangeEvent) => setMonth(e.target.value || null)}
            >
              <MenuItem value="">All</MenuItem>
              {availableMonths.map((m) => (
                <MenuItem key={m} value={m}>{formatMonthYear(m)}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}

        <Autocomplete
          multiple
          size="small"
          options={sortedCategories}
          value={filters.categoryFilter}
          onChange={(_, newVal) => setCategoryFilter(newVal)}
          renderInput={(params) => (
            <TextField {...params} label="Categories" placeholder="Search..." />
          )}
          renderOption={renderCategoryOption}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={`${option} ${categoryPct[option] ? categoryPct[option] + '%' : ''}`}
                size="small"
              />
            ))
          }
          sx={{ minWidth: 180, maxWidth: 360, flex: '0 1 auto' }}
          disableCloseOnSelect
        />

        <Autocomplete
          multiple
          size="small"
          options={sortedCategories}
          value={filters.excludeCategories}
          onChange={(_, newVal) => setExcludeCategories(newVal)}
          renderInput={(params) => (
            <TextField {...params} label="Exclude" placeholder="Search..." />
          )}
          renderOption={renderCategoryOption}
          renderTags={(value, getTagProps) =>
            value.map((option, index) => (
              <Chip
                {...getTagProps({ index })}
                key={option}
                label={`${option} ${categoryPct[option] ? categoryPct[option] + '%' : ''}`}
                size="small"
                color="error"
                variant="outlined"
              />
            ))
          }
          sx={{ minWidth: 160, maxWidth: 320, flex: '0 1 auto' }}
          disableCloseOnSelect
        />

        <FormControl size="small" sx={{ minWidth: 130 }}>
          <InputLabel>Account</InputLabel>
          <Select<string[]>
            multiple
            value={filters.accountFilter}
            onChange={(e) => setAccountFilter(e.target.value as string[])}
            renderValue={(selected) => (
              <Box display="flex" flexWrap="wrap" gap={0.5}>
                {selected.map((v) => (
                  <Chip key={v} label={v} size="small" />
                ))}
              </Box>
            )}
          >
            {availableAccounts.map((a) => (
              <MenuItem key={a} value={a}>{a}</MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box flex={1} />

        <Tooltip title={dark ? 'Light mode' : 'Dark mode'}>
          <ThemeToggleButton onClick={toggleMode} size="small">
            {dark ? <LightModeIcon fontSize="small" /> : <DarkModeIcon fontSize="small" />}
          </ThemeToggleButton>
        </Tooltip>

        <Tooltip title="Import new CSV">
          <UploadButton onClick={clearData} size="small">
            <FileUploadIcon fontSize="small" />
          </UploadButton>
        </Tooltip>
      </StyledToolbar>
    </StyledAppBar>
  );
}
