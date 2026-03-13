import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import { styled } from '@mui/material/styles';
import ChartCard from '../common/ChartCard';
import { useWalletAnalytics } from '../../context/WalletContext';
import { formatCurrency } from '../../utils/formatters';

const StyledTableContainer = styled(TableContainer)({
  maxHeight: 350,
});

const BoldHeaderCell = styled(TableCell)({
  fontWeight: 600,
});

const IncomeCell = styled(TableCell)({
  color: '#10b981',
  fontWeight: 500,
});

const ExpenseCell = styled(TableCell)({
  color: '#ef4444',
  fontWeight: 500,
});

export default function AccountSummary() {
  const { accountSummary } = useWalletAnalytics();

  return (
    <ChartCard title="Account Summary" height={350}>
      <StyledTableContainer>
        <Table size="small" stickyHeader>
          <TableHead>
            <TableRow>
              <BoldHeaderCell>Account</BoldHeaderCell>
              <BoldHeaderCell align="right">Income</BoldHeaderCell>
              <BoldHeaderCell align="right">Expense</BoldHeaderCell>
              <BoldHeaderCell align="right">Net</BoldHeaderCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {accountSummary.map((row) => (
              <TableRow key={row.account} hover>
                <TableCell>{row.account}</TableCell>
                <IncomeCell align="right">
                  {formatCurrency(row.income)}
                </IncomeCell>
                <ExpenseCell align="right">
                  {formatCurrency(row.expense)}
                </ExpenseCell>
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
      </StyledTableContainer>
    </ChartCard>
  );
}
