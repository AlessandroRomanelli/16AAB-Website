(function () {
  const form = document.querySelector('main form');
  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const username = event.target[0].value
    const password = event.target[1].value
    console.log({username, password})
    doJSONRequest('POST', '/admin/login', {}, {username, password}).then(response => {
      if (response.status === 200) {
        window.location.pathname = '/admin'
      } else {
        console.log('Failed to login')
      }
    })
  })
}());
