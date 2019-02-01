(function () {
  const quill = new Quill('#editor', {
    theme: 'snow'
  });


  const form = document.querySelector('form')

  if (image) {
    const images = document.querySelectorAll('.image-select .screenshot')
    images.forEach(screenshot => {
      if (screenshot.dataset.id === image) {
        screenshot.querySelector('input').checked = true
      }
    })
  }

  if (screenshots) {
    const images = document.querySelectorAll('.screenshots-select .screenshot')
    images.forEach(screenshot => {
      if (screenshots.includes(screenshot.dataset.id)) {
        screenshot.querySelector('input').checked = true
      }
    })
  }

  const method = form.dataset.method
  let id = ""
  if (form.dataset.id) {
    id = "/"+form.dataset.id
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const title = event.target.querySelector('input[name="title"]').value
    const content = document.querySelector('.ql-editor').innerHTML
    const setting = event.target.querySelector('input[name="setting"]').value
    const region = event.target.querySelector('input[name="region"]').value
    const image = event.target.querySelector('input[name="image"]:checked').value
    const screens = event.target.querySelectorAll('input[type="checkbox"]:checked')
    const status = event.target.querySelector('select[name="status"]').value
    const screenshots = []
    for (var i = 0; i < screens.length; i++) {
      screenshots.push(screens[i].value)
    }

    const body = {title, content, setting, region, image, screenshots, status}

    const regEx = /<script[^>]*>/gm;
    if (regEx.test(content)) {
      return displayError('Your content contains a script tag. Not allowed!')
    }
    if (title.trim() === "") {
      return displayError('You forgot to provide a title for this news!')
    }
    if (status === "") {
      return displayError('You must choose a status for this campaign')
    }
    doJSONRequest(method, '/campaign'+id, {}, body).then(response => {
      if (response.status === 200 || response.status === 201) {
        window.location.pathname = '/admin'
      } else {
        displayError(response.status+": "+response.message)
      }
    })
  })
}());
