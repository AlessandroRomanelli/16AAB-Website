(function () {
  const form = document.querySelector('form')

  const displayError = (message) => {
    alert(message)
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const title = event.target.querySelector('input[name="title"]').value
    const description = document.querySelector('textarea[name="description"]').value
    const image = imgSrc

    if (title === "") {
      displayError('You forgot to provide a title for this news!')
      return
    }

    doJSONRequest('POST', '/screenshot', {}, {title, image, description}).then(response => {
      if (response.status === 200 || response.status === 201) {
        window.location.pathname = '/admin'
      } else {
        displayError(response.status+": "+response.message)
      }
    })
  })

  const imageUploader = document.querySelector('form input[type="file"]')
  const imgPreview = document.querySelector('img.preview')
  let imgSrc = ""
  const reader = new FileReader()
  reader.addEventListener('load', () => {
    imgPreview.src = reader.result
    imgSrc = reader.result
  }, false)

  imageUploader.addEventListener('input', (event) => {
    if (event.target.files[0]) {
      reader.readAsDataURL(event.target.files[0])
    } else {
      imgPreview.src = ""
      imgSrc = ""
    }
  })
}());
