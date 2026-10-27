// element ids shared by the server render (renderPage.js) and the browser
// hydration entry (client.js); kept separate so the browser bundle does not
// pull in react-dom/server
export const dataElementId = '__STATUS_PAGE_DATA__'
export const rootElementId = '__status_page'
