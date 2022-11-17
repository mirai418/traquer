import { Op } from 'sequelize';
import { isNil, isPlainObject, isArray, omitBy, groupBy, orderBy } from 'lodash-es';

import AwardSeat from '../models/award-seat.js';
import Subscription from '../models/subscription.js';
import { send } from '../utils/mailer.js';
import User from '../models/user.js';

function isNilOrEmpty<T>(val: T): boolean {
  return (isArray(val) || isPlainObject(val)) ? (Object.keys(<[] | object>val).length + Object.getOwnPropertySymbols(val).length) === 0 : isNil(val);
}

async function getUpdates(subscription: Subscription): Promise<AwardSeat[]> {
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
  await subscription.update({
    lastCheckedAt: new Date(),
  });
  return updates;
}

async function humanizeUpdates(updates: AwardSeat[]) {
  const res = [];
  for (let i = 0; i < updates.length; i++) {
    const update = updates[i];
    res.push({
      availabilityId: update.availabilityId,
      date: update.date,
      humanized: await update.humanize(),
    });
  }
  return groupBy(orderBy(res, 'date'), 'availabilityId');
}


async function checkSubscriptions() {
  const startTime = new Date();
  console.log(`--> checkSubscriptions | starting: ${startTime} (${startTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST).`);
  let totalUpdatesCount = 0;
  const users = await User.findAll();
  for (let i = 0; i < users.length; i++) {
    const user = users[i];
    const subscriptions = await Subscription.findAll({
      where: {
        userId: user.id,
      },
    });
    let updates: AwardSeat[] = [];
    for (let i = 0; i < subscriptions.length; i++) {
      updates = updates.concat(await getUpdates(subscriptions[i]));
    }
    if (updates.length > 0) {
      totalUpdatesCount += updates.length;
      const sanitizedUpdates = await humanizeUpdates(updates);
      send(user.email, '[traquer] New Updates on Award Seats', 'updates-found-template', {
        user: user,
        updatesCount: updates.length,
        updates: sanitizedUpdates,
      });
    }
  }
  const endTime = new Date();
  const duration = endTime.getTime() - startTime.getTime();
  console.log(`--> checkSubscriptions | done: ${endTime} (${endTime.toLocaleString('ja-JP', { timeZone: 'Asia/Tokyo' })} JST). Took: ${duration}ms.`);
  return totalUpdatesCount;
}

export default checkSubscriptions;
