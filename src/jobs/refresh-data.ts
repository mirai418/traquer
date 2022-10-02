import refreshDataSlice from './refresh-data-slice.js';
import Region from '../models/region.js';
import Seat from '../models/seat.js';
import Status from '../models/status.js';

const noFirstClassRegionIds = [1, 2, 7];

async function sleep(milliseconds: number) {
  return new Promise(resolve => setTimeout(resolve, milliseconds));
}

async function refreshData(statuses?: Status[], seats? : Seat[], regions?: Region[]) {
  const startTime = new Date();
  console.log(`--> refreshData | starting: ${startTime} (${startTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST).`);
  [statuses, seats, regions] = await Promise.all([
    statuses || await Status.findAll(),
    seats || await Seat.findAll(),
    regions || await Region.findAll(),
  ]);

  for (let i = 0; i < statuses.length; i++) {
    const status = statuses[i];
    for (let j = 0; j < seats.length; j++) {
      const seat = seats[j];
      for (let k = 0; k < regions.length; k++) {
        const region = regions[k];
        if (seat.id !== 4 || noFirstClassRegionIds.indexOf(region.id) < 0) {
          console.log(`--> refreshData:refreshData | checking... Status: ${status.name}, Class: ${seat.name}, Region: ${region.name}`);
          await refreshDataSlice(<Status>status, <Seat>seat, <Region>region);
          await sleep(100);
        }
      }
    }
  }

  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log(`--> refreshData | done: ${endTime} (${endTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST). Took: ${duration}ms.`);
  return {
    duration: duration,
  };
}

export default refreshData;
