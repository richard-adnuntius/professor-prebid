import './GanttChartComponent.scss';
import { IPrebidDetails } from "../../../../inject/scripts/prebid";
import { IGoogleAdManagerDetails } from "../../../../inject/scripts/googleAdManager";
import React, { useEffect, useRef } from 'react';
import { createRangeArray, getMinAndMaxNumber } from '../../../../utils';

const GanttChartComponent = ({ prebid, googleAdManager }: IGanttChartComponentProps): JSX.Element => {
  const gridRef = useRef(null)
  const prebidEvents = prebid?.events || [];
  const allEventTimestamps: number[] = [
    ...prebidEvents
      .filter(event => ['bidRequested', 'bidResponse', 'noBid'].includes(event.eventType))
      .map(event => [event.args.start, event.args.requestTimestamp, event.args.responseTimestamp])
      .flat()
      .filter(el => el)
      .sort(),
    googleAdManager?.postAuctionStartTimestamp,
    googleAdManager?.postAuctionEndTimestamp,
  ];

  const allBidderEvents =
    prebidEvents
      .filter(event => ['bidRequested', 'bidResponse', 'noBid'].includes(event.eventType))
      .reduce((previousValue, event) => {
        const tmp = [...previousValue];
        const index = tmp.findIndex(bidderRequest =>
          event.args.auctionId === bidderRequest.args.auctionId
          && (
            event.args.bidderCode === bidderRequest.args.bidderCode || event.args.bidder === bidderRequest.args.bidderCode
          )
        );
        switch (event.eventType) {
          case 'bidRequested': {
            tmp.push(event);
            break;
          }
          case 'bidResponse': {
            tmp[index].args.endTimestamp = event.args.responseTimestamp;
            break;
          }
          case 'noBid': {
            tmp[index].args.endTimestamp = Math.floor(tmp[index].args.start + event.elapsedTime - tmp[index].elapsedTime);
            break
          }
        }
        return tmp;
      }, []);


  const createGridBarElements = () => {
    const { min, max } = getMinAndMaxNumber(allEventTimestamps);
    return createRangeArray(min - 50, max + 150, 10)
      .map((val, index) => <li key={index} {...{ 'data-timestamp': val }}></li>)
  }

  const getGridBarElement = (input: number) => {
    const allGridBarsCollection = gridRef?.current?.children as HTMLCollection;
    const allGridBarsArray = Array.from(allGridBarsCollection || []);
    const nearestGridBar = allGridBarsArray.sort((a: any, b: any) => Math.abs(Number(a.dataset.timestamp) - input) - Math.abs(Number(b.dataset.timestamp) - input))[0] as HTMLElement;
    return nearestGridBar;
  }

  const createBidderRowElements = () => {
    return allBidderEvents
      .sort((a, b) => a.args.start - b.args.start)
      .map((bidderRequest, index) => {
        const startGridBar = getGridBarElement(bidderRequest.args.start);
        const endGridBar = getGridBarElement(bidderRequest.args.endTimestamp);
        const left = startGridBar?.offsetLeft;
        const width = endGridBar?.offsetLeft + endGridBar?.offsetWidth - left;
        return <li key={index} style={{ width: `${width}px`, left: `${left}px` }}>
          <div>{bidderRequest.args.bidderCode}: {bidderRequest.args.endTimestamp - bidderRequest.args.start}ms</div>
        </li>
      }
      );
  }

  const createPostAuctionRow = () => {
    const startGridBar = getGridBarElement(googleAdManager.postAuctionStartTimestamp);
    const endGridBar = getGridBarElement(googleAdManager.postAuctionEndTimestamp);
    const left = startGridBar?.offsetLeft;
    const width = endGridBar?.offsetLeft + endGridBar?.offsetWidth - left;
    return <li style={{ width: `${width}px`, left: `${left}px` }} >
      <div>post-auction: {googleAdManager.postAuctionEndTimestamp - googleAdManager.postAuctionStartTimestamp}ms</div>
    </li>
  }

  return (
    <div className="chart-wrapper">
      <ul className="chart-values" ref={gridRef}>
        {(allBidderEvents.length !== 0) ? createGridBarElements() : ''}
      </ul>
      <ul className="chart-bars">
        {(allBidderEvents.length !== 0) ? createBidderRowElements() : ''}
        {(googleAdManager?.postAuctionStartTimestamp && googleAdManager?.postAuctionEndTimestamp) ? createPostAuctionRow() : ''}
      </ul>
    </div>
  );
};

interface IGanttChartComponentProps {
  prebid: IPrebidDetails;
  googleAdManager: IGoogleAdManagerDetails;
}

export default GanttChartComponent;
