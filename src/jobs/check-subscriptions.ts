import { Op } from 'sequelize';
import { isNil, isPlainObject, isArray, omitBy } from 'lodash-es';

import AwardSeat from '../models/award-seat.js';
import Subscription from '../models/subscription.js';
import { stringify } from '../utils/printer.js';

function isNilOrEmpty(val: any) {
  return (isArray(val) || isPlainObject(val)) ? (Object.keys(val).length + Object.getOwnPropertySymbols(val).length) === 0 : isNil(val);
}

async function checkSubscription(subscription: Subscription) {
  const whereOptions = omitBy({
    routeFrom: subscription.routeFrom,
    routeTo: subscription.routeTo,
    statusId: subscription.statusId,
    seatId: subscription.seatId,
    availabilityId: subscription.availabilityId,
    date: omitBy({
      [Op.gte]: subscription.startDate,
      [Op.lte]: subscription.endDate,
    }, isNilOrEmpty),
    createdAt: omitBy({
      [Op.gte]: subscription.lastCheckedAt,
    }, isNilOrEmpty),
    isLatest: true,
  }, isNilOrEmpty);
  const updates = await AwardSeat.findAll({
    where: whereOptions,
    order: [['date', 'ASC']],
  });
  console.log(`--> checkSubscriptions:checkSubscriptions | ${updates.length} update(s) found on Subscription: ` + await stringify(subscription));
  for (let i = 0; i < updates.length; i++) {
    console.log(`--> checkSubscriptions:checkSubscriptions | ` + await stringify(updates[i]));
  }
  await subscription.update({
    lastCheckedAt: new Date(),
  });
}

async function checkSubscriptions() {
  const subscriptions = await Subscription.findAll();
  for (let i = 0; i < subscriptions.length; i++) {
    await checkSubscription(subscriptions[i]);
  }
  console.log(`--> checkSubscriptions:checkSubscriptions | done.`);
}

export default checkSubscriptions;
