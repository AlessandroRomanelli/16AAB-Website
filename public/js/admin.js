
(function () {
  msToTimeAgo = (ms) => {
    const seconds = ms/1000
    const minute = 60
    const hour = minute*60
    const day = hour*24
    const week = day*7
    const month = week*4
    const year = month*12
    if (seconds < minute) {
      return `${Math.round(seconds)} seconds`
    } else if (seconds < hour) {
      return `${Math.round(seconds/minute)} minutes`
    } else if (seconds < day) {
      return `${Math.round(seconds/hour)} hours`
    } else if (seconds < week) {
      return `${Math.round(seconds/day)} days`
    } else if (seconds < month) {
      return `${Math.round(seconds/week)} weeks`
    } else if (seconds < year) {
      return `${Math.round(seconds/month)} months`
    } else {
      return `${Math.round(seconds/year)} years`
    }
  }

  const now = Date.now()

  handleDate = (article) => {
    const deltaTime = now - article.dataset.timestamp
    const timeAgo = msToTimeAgo(deltaTime)
    const date = article.querySelector('.date')
    date.innerHTML = timeAgo + ' ago'
  }

  handleNews = (article) => {
    const editBtn = article.querySelector('button:first-child')
    const deleteBtn = article.querySelector('button:last-child')
    editBtn.addEventListener('click', (event) => {
      event.preventDefault()
      window.location.pathname = '/news/'+article.dataset.id+"/edit"
    })
    deleteBtn.addEventListener('dblclick', (event) => {
      event.preventDefault()
      doJSONRequest('DELETE', '/news/'+article.dataset.id, {}, {}).then(response => {
        if (response.status === 200) {
          window.location.reload()
        }
      })
    })
  }

  handleImage = (image) => {
    const id = image.dataset.id
    const editBtn = image.querySelector('button:first-child')
    editBtn.addEventListener('click', (event) => {
      event.preventDefault()
      window.location.pathname = '/screenshot/'+id+'/edit'
    })
    const deleteBtn = image.querySelector('button:last-child')
    deleteBtn.addEventListener('click', (event) => {
      event.preventDefault()
      doJSONRequest('DELETE', '/screenshot/'+id, {}, {}).then(response => {
        console.log(response)
        if (response.status === 200) {
          window.location.reload()
        }
      })
    })
  }


  const displayError = (message) => {
    alert(message)
  }

  if (window.location.pathname === '/admin') {
    const articles = document.querySelectorAll('article.carousel-item')
    articles.forEach(article => {
      handleDate(article)
      handleNews(article)
    })
    const screenshots = document.querySelectorAll('.screenshots .screenshot')
    screenshots.forEach(screenshot => {
      handleImage(screenshot)
    })

  }
}());
