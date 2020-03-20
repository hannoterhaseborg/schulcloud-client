const util = require('util');
const logger = require('../helpers/logger');

const {
	KEEP_ALIVE = false,
	BACKEND_URL = 'http://localhost:3030/',
	PUBLIC_BACKEND_URL,
	EDITOR_URL = undefined,
	SENTRY_DSN = false,
	SC_DOMAIN = 'localhost',
	SC_THEME = 'default',
	REDIS_URI,
	REQUEST_TIMEOUT_MS = 5000, // 5 sec
	NODE_ENV = 'development',
	JWT_SHOW_TIMEOUT_WARNING_SECONDS = 3600, // 60 min
	JWT_TIMEOUT_SECONDS,
	MAXIMUM_ALLOWABLE_TOTAL_ATTACHMENTS_SIZE_BYTE = (5 * 1024 * 1024), // 5MB
	FEATURE_INSIGHTS_ENABLED,
	INSIGHTS_COLLECTOR_URI,
} = process.env;

const FEATURE_ALERTRS_ENABLED = process.env.FEATURE_ALERTRS_ENABLED === 'true';

const exp = {
	KEEP_ALIVE,
	BACKEND_URL,
	PUBLIC_BACKEND_URL,
	EDITOR_URL,
	SENTRY_DSN,
	SC_DOMAIN,
	SC_THEME,
	REDIS_URI,
	REQUEST_TIMEOUT_MS: Number(REQUEST_TIMEOUT_MS),
	NODE_ENV,
	JWT_SHOW_TIMEOUT_WARNING_SECONDS,
	JWT_TIMEOUT_SECONDS,
	MAXIMUM_ALLOWABLE_TOTAL_ATTACHMENTS_SIZE_BYTE,
	FEATURE_INSIGHTS_ENABLED,
	INSIGHTS_COLLECTOR_URI,
	FEATURE_ALERTRS_ENABLED,
};

// eslint-disable-next-line no-console
console.log(util.inspect(exp, { depth: 1, compact: false }));

module.exports = exp;
