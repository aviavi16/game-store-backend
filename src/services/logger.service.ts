// src/services/logger.service.ts

const logger = {
  info,
  error,
  warn,
  debug,
}

function info(message: string, ...optionalParams: any[]) {
  console.log(`ℹ️  INFO: ${message}`, ...optionalParams)
}

function error(message: string, ...optionalParams: any[]) {
  console.error(`❌ ERROR: ${message}`, ...optionalParams)
}

function warn(message: string, ...optionalParams: any[]) {
  console.warn(`⚠️  WARN: ${message}`, ...optionalParams)
}

function debug(message: string, ...optionalParams: any[]) {
  if (process.env.NODE_ENV !== 'production') {
    console.debug(`🐛 DEBUG: ${message}`, ...optionalParams)
  }
}

export default logger
