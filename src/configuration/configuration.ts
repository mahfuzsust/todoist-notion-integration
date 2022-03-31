import 'dotenv/config';

export default {
  PORT: process.env.PORT ?? 3000,
  NOTION_TOKEN: process.env.NOTION_TOKEN,
  NOTION_DATABASE: process.env.NOTION_DATABASE
};
