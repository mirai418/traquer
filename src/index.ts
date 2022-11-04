import dotenv from 'dotenv';
dotenv.config();

import App from './app.js';
import DefaultController from './controllers/default-controller.js';
import AwardSeatController from './controllers/award-seat-controller.js';
import StatusController from './controllers/status-controller.js';
import SeatController from './controllers/seat-controller.js';
import RegionController from './controllers/region-controller.js';
import AvailabilityController from './controllers/availabilities-controller.js';
import SubscriptionsController from './controllers/subscriptions-controller.js';
import JobController from './controllers/job-controller.js';
import AuthController from './controllers/auth-controller.js';

const PORT = Number(process.env.PORT) || 8000;
const app = new App(PORT,
  [
    new DefaultController(),
    new AwardSeatController(),
    new StatusController(),
    new SeatController(),
    new RegionController(),
    new AvailabilityController(),
    new SubscriptionsController(),
    new JobController(),
    new AuthController(),
  ]
);

app.listen();
