import { Snowflake } from 'nodejs-snowflake';

const snowflake = new Snowflake({
  custom_epoch: new Date('2022-08-27T13:53:04Z').getTime(),
  instance_id: 1
});

export default snowflake;
