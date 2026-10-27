import { hydrateRoot } from 'react-dom/client'

import Index from '../pages/index'
import { dataElementId, rootElementId } from './functions/hydration'

const props = JSON.parse(document.getElementById(dataElementId).textContent)

hydrateRoot(document.getElementById(rootElementId), <Index {...props} />)
