import { find, isNil, trim } from 'lodash-es';

import Availability from '../models/availability.js';
import AwardSeat from '../models/award-seat.js';
import Seat from '../models/seat.js';
import Status from '../models/status.js';
import Subscription from '../models/subscription.js';

let availabilities: Availability[];
let seats: Seat[];
let statuses: Status[];

async function stringify(obj: Subscription | AwardSeat) {
  statuses = statuses || await Status.findAll();
  seats = seats || await Seat.findAll();
  availabilities = availabilities || await Availability.findAll();
  let text = '';
  if (obj instanceof Subscription) {
    text += !isNil(obj.startDate) ? `from ${obj.startDate} ` : '';
    text += !isNil(obj.endDate) ? `to ${obj.endDate} ` : '';
  } else if (obj instanceof AwardSeat) {
    text += !isNil(obj.date) ? `on ${obj.date} ` : '';
  }
  text += !isNil(obj.routeFrom) ? `departing ${obj.routeFrom} ` : '';
  text += !isNil(obj.routeTo) ? `arriving at ${obj.routeTo} ` : '';
  text += !isNil(obj.statusId) ? `for ${find(statuses, {id: obj.statusId})?.name} members ` : '';
  text += !isNil(obj.seatId) ? `in ${find(seats, {id: obj.seatId})?.name} class ` : '';
  if (obj instanceof Subscription) {
    text += !isNil(obj.availabilityId) ? `tracking ${find(availabilities, {id: obj.availabilityId})?.name}` : '';
  } else if (obj instanceof AwardSeat) {
    text += !isNil(obj.availabilityId) ? `now ${find(availabilities, {id: obj.availabilityId})?.name}` : '';
  }
  return trim(text);
}

export { stringify };
