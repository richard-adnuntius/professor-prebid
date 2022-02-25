import React from 'react';
import { IPrebidConfig } from '../../../../inject/scripts/prebid';
import Typography from '@mui/material/Typography';
import logger from '../../../../logger';
import Avatar from '@mui/material/Avatar';
import IconButton, { IconButtonProps } from '@mui/material/IconButton';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SettingsApplicationsIcon from '@mui/icons-material/SettingsApplications';
import { styled } from '@mui/styles';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Collapse from '@mui/material/Collapse';
import Grid from '@mui/material/Grid';
import { tileHeight } from './ConfigComponent';

interface ExpandMoreProps extends IconButtonProps {
  expand: boolean;
}

const ExpandMore = styled((props: ExpandMoreProps) => {
  const { expand, ...other } = props;
  return <IconButton {...other} />;
})(({ theme, expand }) => ({
  transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
  marginLeft: 'auto',
}));

const BidderSettingsComponent = ({ config }: IBidderSettingsComponentProps): JSX.Element => {
  const [expanded, setExpanded] = React.useState(false);
  const [maxWidth, setMaxWidth] = React.useState<4 | 8>(4);
  const ref = React.useRef<HTMLInputElement>(null);

  const handleExpandClick = () => {
    setExpanded(!expanded);
    setMaxWidth(expanded ? 4 : 8);
    setTimeout(() => ref.current.scrollIntoView({ behavior: 'smooth' }), 150);
  };
  logger.log(`[PopUp][BidderSettingsComponent]: render `);
  return (
    <Grid item  md={maxWidth} xs={12}  ref={ref}>
      <Card sx={{ width: 1, minHeight: tileHeight, border: '1px solid #0e86d4' }}>
        <CardHeader
          avatar={
            <Avatar sx={{ bgcolor: '#0e86d4' }} aria-label="recipe">
              <SettingsApplicationsIcon />
            </Avatar>
          }
          title="Bidder Settings"
          subheader={'Timeout, ...'}
          action={
            <ExpandMore expand={expanded} aria-expanded={expanded} aria-label="show more">
              <ExpandMoreIcon />
            </ExpandMore>
          }
          onClick={handleExpandClick}
        />
        <Collapse in={!expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <strong> Bidder Sequence: </strong>
              {config.bidderSequence}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Bidder Timeout: </strong>
              {config.bidderTimeout}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Send All Bids:</strong> {String(config.enableSendAllBids)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Timeout Buffer: </strong>
              {config.timeoutBuffer}
            </Typography>
          </CardContent>
        </Collapse>
        <Collapse in={expanded} timeout="auto" unmountOnExit>
          <CardContent>
            <Typography variant="body2" color="text.secondary">
              <strong> Bidder Sequence: </strong>
              {config.bidderSequence}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Bidder Timeout: </strong>
              {config.bidderTimeout}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Send All Bids:</strong> {String(config.enableSendAllBids)}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Timeout Buffer: </strong>
              {config.timeoutBuffer}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Max Nested Iframes:</strong> {config.maxNestedIframes}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              <strong> Use Bid Cache:</strong> {String(config.useBidCache)}
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ wordBreak: 'break-word' }}>
              <strong> Bid Cache Url:</strong> {config.cache?.url}
            </Typography>
          </CardContent>
        </Collapse>
      </Card>
    </Grid>
  );
};

interface IBidderSettingsComponentProps {
  config: IPrebidConfig;
}

export default BidderSettingsComponent;
