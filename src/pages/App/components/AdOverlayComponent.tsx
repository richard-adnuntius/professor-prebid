import React, { useState, useEffect } from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { theme } from '../../../theme/theme';
import { ThemeProvider } from '@mui/material';
import GamDetailsComponent from './GamDetailsComponent';
import Paper from '@mui/material/Paper';
import PopOverComponent from './PopOverComponent';
import { CacheProvider } from '@emotion/react';
import createCache from '@emotion/cache';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import Close from '@mui/icons-material/Close';
import Refresh from '@mui/icons-material/Refresh';
import MinimizeIcon from '@mui/icons-material/Minimize';
import MaximizeIcon from '@mui/icons-material/Maximize';
import OpenInFullIcon from '@mui/icons-material/OpenInFull';

const AdOverlayComponent = ({
  elementId,
  winningCPM,
  winningBidder,
  currency,
  timeToRespond,
  closePortal,
  contentRef,
  pbjsNameSpace,
}: AdOverlayComponentProps): JSX.Element => {
  const gridRef = React.useRef<HTMLDivElement>(null);
  const boxRef = React.useRef<HTMLDivElement>(null);
  const [truncate, setTruncate] = useState<boolean>(false);
  const [expanded, setExpanded] = useState<boolean>(true);
  const [anchorEl, setAnchorEl] = React.useState<HTMLElement | null>(null);
  const [slot, setSlot] = React.useState<googletag.Slot>(null);
  const cache = createCache({ key: 'css', container: contentRef?.contentWindow?.document?.head, prepend: true });
  const openInPopOver = () => {
    setAnchorEl(window.top.document.body);
  };
  useEffect(() => {
    if (window.parent.googletag && typeof window.parent.googletag?.pubads === 'function') {
      const pubads = googletag.pubads();
      const slots = pubads.getSlots();
      const slot = slots.find((slot) => slot.getSlotElementId() === elementId);
      if (slot) {
        setSlot(slot);
      }
    }
  }, [elementId]);
  useEffect(() => {
    if (!truncate) {
      setTruncate(gridRef.current?.offsetHeight > boxRef.current?.offsetHeight || false);
    }
  }, [gridRef.current?.offsetHeight, boxRef.current?.offsetHeight, truncate]);
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cache}>
        <Box
          ref={boxRef}
          sx={{
            height: expanded ? '100%' : 'auto',
            width: '100%',
            opacity: 1,
            backgroundColor: 'primary.light',
            color: 'text.primary',
            padding: 0.5,
            boxSizing: 'border-box',
            flexGrow: 1,
            '&:hover': { opacity: 1 },
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
          }}
        >
          <Grid container justifyContent="flex-start" alignItems="flex-start" ref={gridRef} rowSpacing={0.2}>
          </Grid>
        </Box>
      </CacheProvider>
    </ThemeProvider>
  );
};

export interface AdOverlayComponentProps {
  elementId: string;
  winningBidder: string;
  winningCPM: number;
  currency: string;
  timeToRespond: number;
  closePortal?: () => void;
  contentRef?: any;
  pbjsNameSpace?: string;
}

export default AdOverlayComponent;
