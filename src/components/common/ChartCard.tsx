import { useState } from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import { styled } from '@mui/material/styles';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';
import CloseIcon from '@mui/icons-material/Close';
import type { ChartCardProps } from '../../types';

const StyledCard = styled(Card)({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
});

const StyledCardContent = styled(CardContent)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
});

const ExpandButton = styled(IconButton)(({ theme }) => ({
  color: theme.palette.text.secondary,
  '&:hover': {
    color: theme.palette.primary.main,
    backgroundColor: 'rgba(99,102,241,0.08)',
  },
}));

const StyledDialogTitle = styled(DialogTitle)({
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
  paddingBottom: 8,
});

const StyledDialogContent = styled(DialogContent)({
  paddingBottom: 24,
});

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
}: ChartCardProps) {
  const [localExpanded, setLocalExpanded] = useState(false);

  const isControlled = controlledExpanded !== undefined;
  const expanded = isControlled ? controlledExpanded : localExpanded;
  const handleClose = isControlled ? controlledOnClose : () => setLocalExpanded(false);
  const handleOpen = isControlled ? undefined : () => setLocalExpanded(true);

  return (
    <>
      <StyledCard>
        <StyledCardContent>
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
              <ExpandButton size="small" onClick={handleOpen}>
                <OpenInFullIcon fontSize="small" />
              </ExpandButton>
            </Box>
          </Box>
          <Box sx={{ flex: 1, minHeight: height }}>{children}</Box>
        </StyledCardContent>
      </StyledCard>

      <Dialog open={expanded} onClose={handleClose} fullWidth maxWidth="lg">
        <StyledDialogTitle>
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
        </StyledDialogTitle>
        <StyledDialogContent>
          <Box sx={{ height: expandedHeight }}>
            {expandedContent || children}
          </Box>
        </StyledDialogContent>
      </Dialog>
    </>
  );
}
