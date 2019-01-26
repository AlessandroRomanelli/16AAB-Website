(function () {
  const quill = new Quill('#editor', {
    theme: 'snow'
  });

  const form = document.querySelector('form')
  const method = form.dataset.method
  let id = ""
  if (form.dataset.id) {
    id = "/"+form.dataset.id
  }

  form.addEventListener('submit', (event) => {
    event.preventDefault()
    const title = event.target.querySelector('input[name="title"]').value
    const content = document.querySelector('.ql-editor').innerHTML
    const image = imgSrc

    const regEx = /<script[^>]*>/gm;
    if (regEx.test(content)) {
      displayError('Your content contains a script tag. Not allowed!')
      return
    }
    if (title === "") {
      displayError('You forgot to provide a title for this news!')
      return
    }
    doJSONRequest(method, '/news'+id, {}, {title, content, image}).then(response => {
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
