import { useState } from 'react'

import { useIsClient, useKeyPress } from '../src/functions/helpers'
import MonitorCard from '../src/components/monitorCard'
import MonitorFilter from '../src/components/monitorFilter'
import MonitorStatusHeader from '../src/components/monitorStatusHeader'
import ThemeSwitcher from '../src/components/themeSwitcher'

// Rendered on the Worker by src/functions/renderPage.js (which also renders
// <head>) and hydrated in the browser by src/client.js with the same props
export default function Index({ config, kvMonitors, kvMonitorsLastUpdate }) {
  const [visible, setVisible] = useState(config.monitors)
  const slash = useKeyPress('/')
  const isClient = useIsClient()

  const filterByTerm = (term) =>
    setVisible(
      config.monitors.filter((monitor) =>
        monitor.name.toLowerCase().includes(term),
      ),
    )

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center p-4 bg-gray-700 text-gray-300 mt-2 mb-2 rounded-lg">
          <div className="flex flex-row items-center">
            <img className="h-8 w-auto" src={config.settings.logo} />
            <h1 className="ml-4 text-xl">{config.settings.title}</h1>
          </div>
          <div className="flex flex-row items-center">
            {isClient && <ThemeSwitcher />}
            <MonitorFilter active={slash} callback={filterByTerm} />
          </div>
        </div>
        <MonitorStatusHeader kvMonitorsLastUpdate={kvMonitorsLastUpdate} />
        {visible.map((monitor, key) => {
          return (
            <MonitorCard
              key={key}
              monitor={monitor}
              data={kvMonitors[monitor.id]}
            />
          )
        })}
        <div className="flex flex-row justify-between mt-4 text-sm">
          <div>
            Powered by{' '}
            <a href="https://workers.cloudflare.com/" target="_blank">
              Cloudflare Workers{' '}
            </a>
            &{' '}
            <a href="https://react.dev/" target="_blank">
              React{' '}
            </a>
          </div>
          <div>
            <a
              href="https://www.devoplus.com.tr/"
              target="_blank"
            >
              Devoplus
            </a>
          </div>
        </div>
      </div>
    </div>
  )
}
