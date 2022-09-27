import { default as axios } from 'axios';
import { WhereOptions } from 'sequelize';
import { isNil } from 'lodash-es';

import AwardSeat from '../models/award-seat.js';
import Region from '../models/region.js';
import Seat from '../models/seat.js';
import Status from '../models/status.js';
import { stringify } from '../utils/printer.js';

function createUrl(seat: Seat, region: Region, status: Status) {
  const date = new Date('2022-09-01').getTime();
  return `https://cam.ana.co.jp/amctop/CAL_${seat.lookupId}_${region.lookupId}_${status.lookupId}.js?_=${date}`;
}

async function conditionalInsert(condition: WhereOptions<AwardSeat>, availabilityId: number) {
  try {
    const latest = await AwardSeat.findOne({
      where: condition,
    });
    if (!isNil(latest) && latest.availabilityId !== availabilityId) {
      console.log(`--> refresh-data-slice:conditionalInsert | found update on Award Seat: ${await stringify(latest)}`);
      await latest.update({
        isLatest: false,
      });
    }
    if (isNil(latest) || latest.availabilityId !== availabilityId) {
      console.log(`--> refresh-data-slice:conditionalInsert | inserting data ${await stringify(<AwardSeat>condition)} with availability_id=${availabilityId}`);
      const insert = {
        ...condition,
        availabilityId: availabilityId,
      };
      await AwardSeat.create(<AwardSeat>insert);
    }
  } catch (error: any) {
    console.log(`!!! refresh-data-slice:conditionalInsert | failed to insert data ${await stringify(<AwardSeat>condition)} with availability_id=${availabilityId}`);
    console.log(error.stack);
  }
}

async function getData(url: string) {
  try {
    const response = await axios.get(url);
    const parsedData = JSON.parse(response.data.replace('cal(', '').replace(')', ''));
    return parsedData;
  } catch (error) {
    // should throw proper error and propagate
    console.log(`!!! refresh-data-slice:getData | failed to get data from ${url}`);
    console.log(error);
    return [[]];
  }
}

async function insertData(data: any[], status: Status, seat: Seat, region: Region) {
  const dates = data.shift();
  dates.shift();
  dates.shift();
  await Promise.all(data.map(async (row) => {
    const routeFrom = row.shift();
    const routeTo = row.shift();
    for (let i = 0; i < row.length; i++) {
      const availabilityId = parseInt(row[i]);
      await conditionalInsert({
        date: new Date(dates[i]),
        routeFrom: routeFrom,
        routeTo: routeTo,
        regionId: region.id,
        statusId: status.id,
        seatId: seat.id,
        isLatest: true,
      }, availabilityId);
    }
  }));
}

async function refreshDataSlice(status: Status, seat: Seat, region: Region) {
  const url = createUrl(seat, region, status);
  const data = await getData(url);
  await insertData(data, status, seat, region);
}

export default refreshDataSlice;
