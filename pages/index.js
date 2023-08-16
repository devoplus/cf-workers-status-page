import { Store } from 'laco'
import { useStore } from 'laco-react'
import Head from 'flareact/head'

import { getKVMonitors, useKeyPress } from '../src/functions/helpers'
import config from '../config.yaml'
import MonitorCard from '../src/components/monitorCard'
import MonitorFilter from '../src/components/monitorFilter'
import MonitorStatusHeader from '../src/components/monitorStatusHeader'
import ThemeSwitcher from '../src/components/themeSwitcher'

const MonitorStore = new Store({
  monitors: config.monitors,
  visible: config.monitors,
  activeFilter: false,
})

const filterByTerm = (term) =>
  MonitorStore.set((state) => ({
    visible: state.monitors.filter((monitor) =>
      monitor.name.toLowerCase().includes(term),
    ),
  }))

export async function getEdgeProps() {
  // get KV data
  const kvMonitors = await getKVMonitors()

  return {
    props: {
      config,
      kvMonitors: kvMonitors ? kvMonitors.monitors : {},
      kvMonitorsLastUpdate: kvMonitors ? kvMonitors.lastUpdate : {},
    },
    // Revalidate these props once every x seconds
    revalidate: 5,
  }
}

export default function Index({ config, kvMonitors, kvMonitorsLastUpdate }) {
  const state = useStore(MonitorStore)
  const slash = useKeyPress('/')

  return (
    <div className="min-h-screen">
      <Head>
        <title>{config.settings.title}</title>
        <link rel="stylesheet" href="./style.css" />
        <script>
          {`
          function setTheme(theme) {
            document.documentElement.classList.remove("dark", "light")
            document.documentElement.classList.add(theme)
            localStorage.theme = theme
          }
          (() => {
            const query = window.matchMedia("(prefers-color-scheme: dark)")
            query.addListener(() => {
              setTheme(query.matches ? "dark" : "light")
            })
            if (["dark", "light"].includes(localStorage.theme)) {
              setTheme(localStorage.theme)
            } else {
              setTheme(query.matches ? "dark" : "light")
            }
          })()

          
          const xhr = new XMLHttpRequest();
          xhr.open("GET", "https://cf-uptime-logger.svrtech.workers.dev/");
          xhr.send();
          xhr.responseType = "json";
          xhr.onload = () => {
            if (xhr.readyState == 4 && xhr.status == 200) {
              var data = xhr.response;
              
              var totalDowntime = 0;    
              var downtimes = jlinq.from(data).equals("statusCode", 0).select();
              for (var i = 0; i < downtimes.length; i++) {
              	var uptime = jlinq.from(data).equals("statusCode", 1).greater("timestamp", downtimes[i].timestamp).first();
                if (uptime != null) {
                	totalDowntime += uptime.timestamp - downtimes[i].timestamp;
                } else {
                	totalDowntime += new Date().getTime() - downtimes[i].timestamp;
                }
              }
              
              console.log("Total downtime " + totalDowntime + "ms.");
              console.log("Yearly uptime: " + (100 - ((31536000000 / (31536000000 - totalDowntime)) - 1)).toFixed(2) + "%");
            } else {
              console.log(`Error: ${xhr.status}`);
            }
          };
          `}
        </script>
      </Head>
      <div className="container mx-auto px-4">
        <div className="flex flex-row justify-between items-center p-4">
          <div className="flex flex-row items-center">
            <img className="h-8 w-auto" src={config.settings.logo} />
            <h1 className="ml-4 text-3xl">{config.settings.title}</h1>
          </div>
          <div className="flex flex-row items-center">
            {typeof window !== 'undefined' && <ThemeSwitcher />}
            <MonitorFilter active={slash} callback={filterByTerm} />
          </div>
        </div>
        <MonitorStatusHeader kvMonitorsLastUpdate={kvMonitorsLastUpdate} />
        {state.visible.map((monitor, key) => {
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
            <a href="https://flareact.com/" target="_blank">
              Flareact{' '}
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
