import config from '../config'
import { useIsClient } from '../functions/helpers'
import { locations } from '../functions/locations'

const classes = {
  green:
    'bg-green-200 text-green-700 dark:bg-green-700 dark:text-green-200 border-green-300 dark:border-green-600',
  yellow:
    'bg-yellow-200 text-yellow-700 dark:bg-yellow-700 dark:text-yellow-200 border-yellow-300 dark:border-yellow-600',
}

export default function MonitorStatusHeader({ kvMonitorsLastUpdate }) {
  const isClient = useIsClient()
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
          {kvMonitorsLastUpdate.time && isClient && (
            <div className="text-xs font-light">
              checked{' '}
              {Math.round((Date.now() - kvMonitorsLastUpdate.time) / 1000)} sec
              ago (from{' '}
              {locations[kvMonitorsLastUpdate.loc] || kvMonitorsLastUpdate.loc})
            </div>
          )}
        </div>
      </div>
      {/* span texts are filled in by the inline <head> script, possibly before
          hydration, so React must not treat them as a mismatch */}
      <div className="card mb-4 font-semibold bg-gray-200 text-gray-700 dark:bg-gray-700 dark:text-gray-200 border-gray-300 dark:border-gray-600">
         <div className="row">
             <div className="col-6">Yearly Total Uptime: <span id="spnYearlyUptime" suppressHydrationWarning>Loading...</span></div>
             <div className="col-6">Yearly Total Downtime: <span id="spnYearlyDowntime" suppressHydrationWarning>Loading...</span></div>
         </div>
         <div className="row">
             <div className="col-6">Monthly Total Uptime: <span id="spnMonthlyUptime" suppressHydrationWarning>Loading...</span></div>
             <div className="col-6">Monthly Total Downtime: <span id="spnMonthlyDowntime" suppressHydrationWarning>Loading...</span></div>
         </div>
      </div>
    </div>
  )
}
