import { existsSync } from 'fs'
import { isEmpty } from 'lodash'
import { format } from 'date-fns'
import dotenv from 'dotenv'

import path from 'path'
import chalk from 'chalk'
import config from '../constants/config'

export const argv = process.argv.slice(2)

export function mlog(str, level = 'debug') {
  const colors = {
    debug: 'cyan',
    error: 'red',
    success: 'green',
    info: 'magenta',
  }

  const display = chalk.bold[colors[level]](`${format(new Date(2014, 1, 11), "yyyy-MM-dd'T'HH:mm:ss.SSSxxx")} - ${str}`)
  console.log(display)
}

export function prelude() {
  const envPathName = path.join(process.cwd(), '.env')

  if (existsSync(envPathName)) {
    dotenv.config()
    const missingValues = config.filter(v => !process.env[v])
    if (!isEmpty(missingValues)) {
      mlog(`Sorry [ ${missingValues.join('/ ')} ] value(s) are missing on your .env file`, 'error')
    }
  } else {
    mlog('Please add your .env file', 'error')
  }
}
