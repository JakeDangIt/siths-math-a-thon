export const requestEndpoint = async (endpoint, method, body) => {
  const config = useRuntimeConfig();
  const session = useSupabaseSession();
  const token = session.value?.access_token;

  const headers = {};

  if (token) headers['Authorization'] = `Bearer ${token}`;

  const options = {};

  if (method) {
    options.method = method;
    options.body = JSON.stringify(body);
    headers['Content-Type'] = 'application/json';
  }

  options.headers = headers;

  const fullUrl = endpoint.startsWith('http') ? endpoint : endpoint;
  const res = await fetch(fullUrl, options);

  const contentLength = res.headers.get('Content-Length');
  const contentType = res.headers.get('Content-Type');

  if (!contentLength || contentType === 'text/plain; charset=utf-8') {
    return undefined;
  }

  let responseText = await res.text();
  if (!responseText) {
    if (!res.ok) {
      throw `Request failed with status ${res.status}`;
    }
    return undefined;
  }

  let jason;
  try {
    jason = JSON.parse(responseText);
  } catch (e) {
    console.error(new Error(`Failed to parse JSON response: ${e.message}`));
    console.error(`Response was: ${responseText}`);
    throw `Failed to parse response from ${endpoint}: ${e.message}`;
  }

  if (!res.ok) {
    console.error(new Error(jason.message || jason.error));
    throw (
      jason.message || jason.error || `Request failed with status ${res.status}`
    );
  }

  return jason;
};
