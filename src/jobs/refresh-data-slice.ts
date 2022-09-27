import { default as axios } from 'axios';
import { WhereOptions } from 'sequelize';
import { isNil } from 'lodash-es';

import AwardSeat from '../models/award-seat.js';
import Region from '../models/region.js';
import Seat from '../models/seat.js';
import Status from '../models/status.js';
import { stringify } from '../utils/printer.js';
import sequelize from '../config/sequelize.js';

function createUrl(seat: Seat, region: Region, status: Status) {
  const date = new Date('2022-09-01').getTime();
  return `https://cam.ana.co.jp/amctop/CAL_${seat.lookupId}_${region.lookupId}_${status.lookupId}.js?_=${date}`;
}

async function conditionalInsert(dates: string[], availabilityIds: string[], condition: WhereOptions<AwardSeat>) {
  const latests = await AwardSeat.findAll({
    where: condition,
  });
  const dateLatestMap = new Map();
  latests.forEach((latest) => {
    const date = new Date(latest.date).getTime();
    dateLatestMap.set(date, latest);
  });
  for (let i = 0; i < dates.length; i++) {
    const date = new Date(dates[i]);
    const availabilityId = parseInt(availabilityIds[i]);
    try {
      const latest = dateLatestMap.get(date.getTime());
      const toBeCreated = <AwardSeat>{
        ...condition,
        date: date,
        availabilityId: availabilityId,
      };
      if (isNil(latest)) {
        const awardSeat = await AwardSeat.create(toBeCreated);
        console.log(`--> refresh-data-slice:conditionalInsert | new Award Seat ${await stringify(awardSeat)}`);
      } else if (latest.availabilityId !== availabilityId) {
        const awardSeat = await sequelize.transaction(async (t) => {
          await latest.update({
            isLatest: false,
          }, {transaction: t});
          return await AwardSeat.create(toBeCreated, {transaction: t});
        });
        console.log(`--> refresh-data-slice:conditionalInsert | updated Award Seat: ${await stringify(awardSeat)}`);
      }
    } catch (error) {
      console.log(`!!! refresh-data-slice:conditionalInsert | failed to update data ${await stringify(<AwardSeat>condition)} with date=${date} and availability_id=${availabilityId}`);
      console.log(error);
    }
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
  await Promise.all(data.map(async (availabilityIds) => {
    const routeFrom = availabilityIds.shift();
    const routeTo = availabilityIds.shift();
    conditionalInsert(dates, availabilityIds, {
      routeFrom: routeFrom,
      routeTo: routeTo,
      regionId: region.id,
      statusId: status.id,
      seatId: seat.id,
      isLatest: true,
    });
  }));
}

async function refreshDataSlice(status: Status, seat: Seat, region: Region) {
  const url = createUrl(seat, region, status);
  const data = await getData(url);
  await insertData(data, status, seat, region);
}

export default refreshDataSlice;
