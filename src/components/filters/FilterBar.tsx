import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Select, { type SelectChangeEvent } from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import Chip from '@mui/material/Chip';
import { useWallet, useWalletAnalytics } from '../../context/WalletContext';
import { formatMonthYear } from '../../utils/formatters';

export default function FilterBar() {
  const {
    filters,
    setPeriodMode,
    setYear,
    setMonth,
    setCategoryFilter,
    setAccountFilter,
    setExcludeCategories,
  } = useWallet();
  const { availableYears, availableMonths, availableCategories, availableAccounts } =
    useWalletAnalytics();

  return (
    <Box
      display="flex"
      flexWrap="wrap"
      gap={2}
      alignItems="center"
      mb={3}
    >
      <ToggleButtonGroup
        value={filters.periodMode}
        exclusive
        onChange={(_, v) => v && setPeriodMode(v)}
        size="small"
      >
        <ToggleButton value="monthly">Monthly</ToggleButton>
        <ToggleButton value="yearly">Yearly</ToggleButton>
      </ToggleButtonGroup>

      <FormControl size="small" sx={{ minWidth: 120 }}>
        <InputLabel>Year</InputLabel>
        <Select
          value={filters.selectedYear ?? ''}
          label="Year"
          onChange={(e: SelectChangeEvent<number | string>) => setYear(e.target.value === '' ? null : Number(e.target.value))}
        >
          <MenuItem value="">All Years</MenuItem>
          {availableYears.map((y) => (
            <MenuItem key={y} value={y}>
              {y}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {filters.periodMode === 'monthly' && filters.selectedYear && (
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel>Month</InputLabel>
          <Select
            value={filters.selectedMonth || ''}
            label="Month"
            onChange={(e: SelectChangeEvent) => setMonth(e.target.value || null)}
          >
            <MenuItem value="">All Months</MenuItem>
            {availableMonths.map((m) => (
              <MenuItem key={m} value={m}>
                {formatMonthYear(m)}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      <Autocomplete
        multiple
        size="small"
        options={availableCategories}
        value={filters.categoryFilter}
        onChange={(_, newVal) => setCategoryFilter(newVal)}
        renderInput={(params) => (
          <TextField {...params} label="Categories" placeholder="Search..." />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              sx={{ borderRadius: '8px' }}
            />
          ))
        }
        sx={{ minWidth: 220, maxWidth: 400 }}
        disableCloseOnSelect
      />

      <Autocomplete
        multiple
        size="small"
        options={availableCategories}
        value={filters.excludeCategories}
        onChange={(_, newVal) => setExcludeCategories(newVal)}
        renderInput={(params) => (
          <TextField {...params} label="Exclude Categories" placeholder="Search..." />
        )}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option}
              label={option}
              size="small"
              color="error"
              variant="outlined"
              sx={{ borderRadius: '8px' }}
            />
          ))
        }
        sx={{ minWidth: 220, maxWidth: 400 }}
        disableCloseOnSelect
      />

      <FormControl size="small" sx={{ minWidth: 160 }}>
        <InputLabel>Account</InputLabel>
        <Select<string[]>
          multiple
          value={filters.accountFilter}
          onChange={(e) => setAccountFilter(e.target.value as string[])}
          renderValue={(selected) => (
            <Box display="flex" flexWrap="wrap" gap={0.5}>
              {selected.map((v) => (
                <Chip key={v} label={v} size="small" sx={{ borderRadius: '8px' }} />
              ))}
            </Box>
          )}
        >
          {availableAccounts.map((a) => (
            <MenuItem key={a} value={a}>
              {a}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </Box>
  );
}
