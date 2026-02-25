import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';

export default function ChartCard({
  title,
  subtitle,
  children,
  height = 300,
  action,
  expandedHeight = 500,
  expandedContent,
  expanded: controlledExpanded,
  onClose: controlledOnClose,
}) {
  const [localExpanded, setLocalExpanded] = useState(false);

  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : localExpanded;
  const handleClose = isControlled ? controlledOnClose : () => setLocalExpanded(false);
  const handleOpen = isControlled ? undefined : () => setLocalExpanded(true);

  return (
    <>
      <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
          <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
            <Box>
              <Typography variant="h6" fontSize={16}>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            <Box display="flex" alignItems="center" gap={0.5}>
              {action}
              <IconButton
                size="small"
                onClick={handleOpen}
                sx={{
                  color: 'text.secondary',
                  '&:hover': { color: 'primary.main', bgcolor: 'rgba(99,102,241,0.08)' },
                }}
              >
                <OpenInFullIcon fontSize="small" />
              </IconButton>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minHeight: height }}>{children}</Box>
        </CardContent>
      </Card>

      <Dialog
        open={expanded}
        onClose={handleClose}
        fullWidth
        maxWidth="lg"
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Box>
            <Typography variant="h6">{title}</Typography>
            {subtitle && (
              <Typography variant="body2" color="text.secondary">
                {subtitle}
              </Typography>
            )}
          </Box>
          <IconButton onClick={handleClose} size="small" sx={{ color: 'text.secondary' }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 3 }}>
          <Box sx={{ height: expandedHeight }}>
            {expandedContent || children}
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
}
