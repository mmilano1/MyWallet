import { useState, useCallback, useRef } from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import Paper from '@mui/material/Paper';
import Alert from '@mui/material/Alert';
import CircularProgress from '@mui/material/CircularProgress';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import { useWallet } from '../../context/WalletContext';
import { parseCsvFile } from '../../utils/csvParser';

export default function CsvImporter() {
  const { setTransactions, setLoading, setError } = useWallet();
  const [dragOver, setDragOver] = useState(false);
  const [localError, setLocalError] = useState(null);
  const [importing, setImporting] = useState(false);
  const fileInputRef = useRef(null);

  const handleFile = useCallback(
    async (file) => {
      if (!file) return;
      if (!file.name.endsWith('.csv')) {
        setLocalError('Please select a CSV file.');
        return;
      }
      setLocalError(null);
      setImporting(true);
      setLoading(true);
      try {
        const transactions = await parseCsvFile(file);
        setTransactions(transactions);
      } catch (err) {
        setLocalError(err.message);
        setError(err.message);
      } finally {
        setImporting(false);
        setLoading(false);
      }
    },
    [setTransactions, setLoading, setError]
  );

  const onDrop = useCallback(
    (e) => {
      e.preventDefault();
      setDragOver(false);
      const file = e.dataTransfer.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  const onDragOver = useCallback((e) => {
    e.preventDefault();
    setDragOver(true);
  }, []);

  const onDragLeave = useCallback(() => setDragOver(false), []);

  const onFileSelect = useCallback(
    (e) => {
      const file = e.target.files[0];
      handleFile(file);
    },
    [handleFile]
  );

  return (
    <Box
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      px={3}
    >
      <Typography variant="h4" fontWeight={700} gutterBottom>
        MyWallet Dashboard
      </Typography>
      <Typography variant="body1" color="text.secondary" mb={4} textAlign="center">
        Import your WalletApp CSV export to get started
      </Typography>

      <Paper
        onDrop={onDrop}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        sx={{
          p: 6,
          maxWidth: 500,
          width: '100%',
          textAlign: 'center',
          border: '2px dashed',
          borderColor: dragOver ? 'primary.main' : 'divider',
          bgcolor: dragOver ? 'action.hover' : 'background.paper',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
        }}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          hidden
          onChange={onFileSelect}
        />

        {importing ? (
          <CircularProgress size={48} />
        ) : (
          <>
            <CloudUploadIcon sx={{ fontSize: 64, color: 'primary.main', mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              Drop your CSV file here
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>
              or click to browse
            </Typography>
            <Button variant="outlined" startIcon={<InsertDriveFileIcon />}>
              Select CSV File
            </Button>
          </>
        )}
      </Paper>

      {localError && (
        <Alert severity="error" sx={{ mt: 2, maxWidth: 500, width: '100%' }}>
          {localError}
        </Alert>
      )}

      <Typography variant="caption" color="text.secondary" mt={3}>
        Accepts semicolon-delimited CSV files exported from WalletApp
      </Typography>
    </Box>
  );
}
