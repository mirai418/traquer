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
  const subscriptionText = `${updates.length} update(s) found on Subscription: ` + await stringify(subscription);
  console.log(`--> checkSubscriptions:checkSubscriptions | ${subscriptionText}`);
  const updateTexts = [];
  for (let i = 0; i < updates.length; i++) {
    const updateText = await stringify(updates[i]);
    console.log(`--> checkSubscriptions:checkSubscriptions | ` + updateText);
    updateTexts.push(updateText);
  }
  await subscription.update({
    lastCheckedAt: new Date(),
  });
  return {
    subscription: subscriptionText,
    updates: updateTexts,
  };
}

async function checkSubscriptions() {
  const startTime = new Date();
  console.log(`--> checkSubscriptions | starting: ${startTime} (${startTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST).`);
  const subscriptions = await Subscription.findAll();
  const results = [];
  for (let i = 0; i < subscriptions.length; i++) {
    results.push(await checkSubscription(subscriptions[i]));
  }

  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log(`--> checkSubscriptions | done: ${endTime} (${endTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST). Took: ${duration}ms.`);
  return results;
}

export default checkSubscriptions;
