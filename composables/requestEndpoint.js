export const requestEndpoint = async (endpoint, method, body) => {
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

  const reqURL = useRequestURL();

  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : `${reqURL.origin}${endpoint}`;

  const res = await fetch(fullUrl, options);

  let responseText = await res.json();

  let jason;
  try {
    jason = responseText;
  } catch (e) {
    console.error(new Error(`Failed to parse JSON response: ${e.message}`));
    console.error(`Response was: ${responseText}`);
    throw new Error(`Failed to parse response from ${endpoint}: ${e.message}`);
  }

  if (!res.ok) {
    console.error(new Error(jason.message || jason.error));
    throw new Error(
      jason.message || jason.error || `Request failed with status ${res.status}`
    );
  }

  return jason;
};
