class Slideshow {
  constructor(elements) {
    this.elements = elements
    this.index = 0
  }

  get current() {
    return this.elements[this.index]
  }

  getNext() {
    return this.elements[(this.index + 1) % this.elements.length]
  }

  getPrev() {
    if (this.index === 0) {
      return this.elements[this.elements.length - 1]
    } else {
      return this.elements[this.index-1]
    }
  }

  next() {
    this.index = (this.index + 1) % this.elements.length
  }

  prev() {
    if (this.index === 0) {
      this.index = this.elements.length - 1
    } else {
      this.index -= 1
    }
  }
}

const displayError = (message) => {
  alert(message)
}

function doFetchRequest(method, url, headers, body) {
  const methods = ['GET', 'POST', 'PUT', 'DELETE'];

  if (arguments.length !== 4) { throw new Error(); }
  if (!(methods.includes(method))) { throw new Error(); }
  if ((method === 'POST' || method === 'PUT') && body !== null && typeof body !== 'string') { throw new Error(); }
  if (method === 'GET' && body !== undefined && body !== null) { throw new Error(); }

  const parameters = { method, headers };
  if (method === 'POST' || method === 'PUT') {
    parameters.body = body;
  }
  return fetch(url, parameters);
}

function doJSONRequest(method, url, headers, body) {
  if (arguments.length !== 4) { throw new Error(); }
  if (headers['Content-Type'] && headers['Content-Type'] !== 'application/json') { throw new Error(); }
  if (headers.Accept && headers.Accept !== 'application/json') { throw new Error(); }

  headers.Accept = 'application/json';
  if (method === 'POST' || method === 'PUT') {
    headers['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  return doFetchRequest(method, url, headers, body).then((result) => {
    if ([200, 201].includes(result.status)) {
      return result.json();
    }
    return result;
  }).catch(err => err);
}
