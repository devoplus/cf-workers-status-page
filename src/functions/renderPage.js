import { renderToString } from 'react-dom/server'

import Index from '../../pages/index'
import config from '../config'
import { getKVMonitors } from './helpers'
import { dataElementId, rootElementId } from './hydration'

// global helpers used by the theme switcher and the uptime summary, rendered
// in <head> so the theme class is set before first paint
// jlinq is served from ./out (public/jlinq.min.js): the former
// cdn.devoplus.com.tr copy answers with Cloudflare error 1016 (origin DNS)
const headScript = `
          function setTheme(theme) {
            document.documentElement.classList.remove("dark", "light")
            document.documentElement.classList.add(theme)
            localStorage.theme = theme
          }

          function calculateTotalDowntime(data) {
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
            return totalDowntime;
          }

          // Yearly
          var r1 = new XMLHttpRequest();
          r1.open("GET", "https://cf-uptime-logger.svrtech.workers.dev/?duration=year");
          r1.send();
          r1.responseType = "json";
          r1.onload = () => {
            if (r1.readyState == 4 && r1.status == 200) {
              var totalDowntime = calculateTotalDowntime(r1.response);
              var dur = moment.duration(totalDowntime);
              document.getElementById('spnYearlyUptime').innerText = (100 - ((31536000000 / (31536000000 - totalDowntime)) - 1)).toFixed(2) + "%";
              document.getElementById('spnYearlyDowntime').innerText = dur.days() + " day(s) " + dur.hours() + " hour(s) " + dur.minutes() + " minute(s) " + dur.seconds() + " second(s)";
            }
          };

          // Monthly
          var r2 = new XMLHttpRequest();
          r2.open("GET", "https://cf-uptime-logger.svrtech.workers.dev/?duration=month");
          r2.send();
          r2.responseType = "json";
          r2.onload = () => {
            if (r2.readyState == 4 && r2.status == 200) {
              var totalDowntime = calculateTotalDowntime(r2.response);
              var dur = moment.duration(totalDowntime);
              document.getElementById('spnMonthlyUptime').innerText = (100 - ((2592000000 / (2592000000 - totalDowntime)) - 1)).toFixed(2) + "%";
              document.getElementById('spnMonthlyDowntime').innerText = dur.days() + " day(s) " + dur.hours() + " hour(s) " + dur.minutes() + " minute(s) " + dur.seconds() + " second(s)";
            }
          };

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
          `

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')

// JSON embedded in a <script> tag; escaping "<" prevents a value such as a
// monitored site's statusText from closing the tag and injecting markup
const serializeProps = (props) =>
  JSON.stringify(props)
    .replace(/</g, '\\u003c')
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')

export async function renderPage(env) {
  // get KV data
  const kvMonitors = await getKVMonitors(env)

  const props = {
    config,
    kvMonitors: kvMonitors ? kvMonitors.monitors : {},
    kvMonitorsLastUpdate: kvMonitors ? kvMonitors.lastUpdate : {},
  }

  const app = renderToString(<Index {...props} />)

  return `<!DOCTYPE html><html lang="en"><head><meta name="viewport" content="width=device-width"/><meta charset="utf-8"/><title>${escapeHtml(
    config.settings.title,
  )}</title><link rel="stylesheet" href="./style.css"/><script src="./jlinq.min.js"></script><script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.31.0/moment.min.js" integrity="sha512-iJIt5wigccZYA4F3G8kWt8H0r43JDWpvBweaGct6QsveuU4zmyP6VX2EXMfSfA/Z80b1PfHUNLioFfY1Z55cCg==" crossorigin="anonymous" referrerpolicy="no-referrer"></script><script>${headScript}</script></head><body><div id="${rootElementId}">${app}</div><script id="${dataElementId}" type="application/json">${serializeProps(
    props,
  )}</script><script type="module" src="./client.js"></script></body></html>`
}
