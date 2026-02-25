import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';

export default function AccountSummary() {
  const { accountSummary } = useWalletAnalytics();

  return (
    <ChartCard title="Account Summary" height={350}>
      <TableContainer sx={{ maxHeight: 350 }}>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 600 }}>Account</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Income</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Expense</TableCell>
              <TableCell align="right" sx={{ fontWeight: 600 }}>Net</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountSummary.map((row) => (
              <TableRow key={row.account} hover>
                <TableCell>{row.account}</TableCell>
                <TableCell align="right" sx={{ color: '#10b981', fontWeight: 500 }}>
                  {formatCurrency(row.income)}
                </TableCell>
                <TableCell align="right" sx={{ color: '#ef4444', fontWeight: 500 }}>
                  {formatCurrency(row.expense)}
                </TableCell>
                <TableCell
                  align="right"
                  sx={{ fontWeight: 600, color: row.net >= 0 ? '#10b981' : '#ef4444' }}
                >
                  {formatCurrency(row.net)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </ChartCard>
  );
}
