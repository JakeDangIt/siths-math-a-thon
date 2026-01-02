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

  console.log('REQUESTING ENEDPOTINT', endpoint, options);

  options.headers = headers;

  const fullUrl = endpoint.startsWith('http')
    ? endpoint
    : process.server
      ? `http://localhost:3000${endpoint}`
      : endpoint;
  const res = await fetch(fullUrl, options);

  const contentLength = res.headers.get('Content-Length');
  const contentType = res.headers.get('Content-Type');

  if (!contentLength || contentType === 'text/plain; charset=utf-8') {
    return undefined;
  }

  let responseText = await res.text();
  if (!responseText) {
    if (!res.ok) {
      throw new Error(`Request failed with status ${res.status}`);
    }
    return undefined;
  }

  let jason;
  try {
    jason = JSON.parse(responseText);
    console.log('bam?', jason);
  } catch (e) {
    console.log(
      'THIS IS THE ERROR CATCH BUT I DONT THINK ITS HERE BUT ITS WORTH A SHOT'
    );
    console.error(new Error(`Failed to parse JSON response: ${e.message}`));
    console.error(`Response was: ${responseText}`);
    throw new Error(`Failed to parse response from ${endpoint}: ${e.message}`);
  }

  console.log('THIS IS BEFORE THE CHECK', jason, res.ok, endpoint);

  if (!res.ok) {
    console.error(new Error(jason.message || jason.error));
    throw new Error(
      jason.message || jason.error || `Request failed with status ${res.status}`
    );
  }

  console.log('RESPONSE FROM ENDPOINT FOR', endpoint, jason);

  return jason;
};
