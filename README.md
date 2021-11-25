# netlify_cors_http
> Make cross-origin requests on the web

https://cors-http.netlify.app/.netlify/functions/api

Try it out in the browser's devtools console

**Note:** Cross-origin requests may still be blocked when using the devtools on some sites. You may encounter a Content Security Policy error or similar.

```javascript
const cors_req_url = ({ url, method, data, headers }) =>
  `${`https://cors-http.netlify.app/.netlify/functions/api`}${((o) => {
    const p = Object.entries(o)
      .filter(([_, v]) => Boolean(v))
      .map((kv) => kv.map((v) => encodeURIComponent(v.toString())))
      .map((kv) => kv.join('='))
      .join('&');
    return Boolean(p) ? `?${p}` : '';
  })({
    method,
    data,
    headers: headers ? JSON.stringify(headers) : undefined,
    url,
  })}`;

fetch(cors_req_url({ url: 'https://example.com/' }))
  .then((response) => response.text())
  .then(console.log);
```

## Api usage

**[GET]** `https://cors-http.netlify.app/.netlify/functions/api?{param}={value}`

Param | Value | Description
--- | --- | ---
*url* | `string` | The target request url
*method* | e.g. `GET POST HEAD` | A HTTP method type. The default method type is **GET**
*data* | `string, json stringified` |  The HTTP Post body 
*headers* |  `json stringified` | The headers to send to the target url
