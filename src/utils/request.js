const headers = new Headers({
  'Accept': 'application/json',
  'Content-Type': 'application/json',
});

async function get(url) {
  try {
    const response = await fetch(url, {
      method: 'GET',
      headers: headers,
    });
    handleResponse(url, response);
  }
  catch (err) {
    console.error(`Request failed. Url = ${url}. Message = ${err}`);
    return Promise.reject({
      error: {
        message: 'Request failed.',
      }
    });
  }
}

async function post(url, data) {
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: headers,
      body: data,
    });
    handleResponse(url, response);
  }
  catch (err) {
    console.error(`Request failed. Url = ${url}. Message = ${err}`);
    return Promise.reject({
      error: {
        message: 'Request failed.',
      }
    });
  }
}

function handleResponse(url, response) {
  if (response.status === 200) {
    return response.json();
  } else {
    console.error(`Request failed. Url = ${url}`);
    return Promise.reject({
      error: {
        message: 'Request failed due to server error',
      }
    });
  }
}

export {
  get,
  post,
}
