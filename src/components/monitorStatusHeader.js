import config from '../../config.yaml'
import { locations } from '../functions/locations'

const classes = {
  green:
    'bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200 border-green-300 dark:border-green-600',
  yellow:
    'bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600',
}

export default function MonitorStatusHeader({ kvMonitorsLastUpdate }) {
  let color = 'green'
  let text = config.settings.allmonitorsOperational

  if (!kvMonitorsLastUpdate.allOperational) {
    color = 'yellow'
    text = config.settings.notAllmonitorsOperational
  }

  return (
    <div>
      <div className={`card mb-4 font-semibold ${classes[color]}`}>
        <div className="flex flex-row justify-between items-center">
          <div>{text}</div>
          {kvMonitorsLastUpdate.time && typeof window !== 'undefined' && (
            <div className="text-xs font-light">
              checked{' '}
              {Math.round((Date.now() - kvMonitorsLastUpdate.time) / 1000)} sec
              ago (from{' '}
              {locations[kvMonitorsLastUpdate.loc] || kvMonitorsLastUpdate.loc})
            </div>
          )}
        </div>
      </div>
      <div class="card mb-4 font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
         <div class="flex flex-row justify-between items-center">
             <div>Yearly Total Uptime: <span id="spnYearlyUptime">Loading...</span></div>
             <div>Yearly Total Downtime (ms): <span id="spnYearlyDowntime">Loading...</span></div>
         </div>
      </div>
    </div>
  )
}
