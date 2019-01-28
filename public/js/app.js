(function () {
  if (window.location.pathname !== "/") {return}

  AOS.init();
  document.addEventListener("DOMContentLoaded", yall);

  const toggleButton = (button) => {
    const opacity = (button.style.opacity !== "") ? Math.abs(parseInt(button.style.opacity) - 1) : 0
    button.style.opacity = opacity
    button.style.pointerEvents = (opacity === 0) ? "none" : "all"
  }

  const carousel = document.querySelector('.news .carousel')
  const carouselNews = document.querySelectorAll('.news .carousel-item')

  const next = (element) => (element.nextElementSibling) ? element.nextElementSibling : element.parentNode.firstElementChild

  const prevBtn = document.querySelector('.news .controls i:first-child')
  const nextBtn = document.querySelector('.news .controls i:last-child')

  if (window.screen.availWidth > 1024) {
    if (carousel.childNodes.length < 3) {
      nextBtn.style.opacity = 0
    }
  } else {
    if (carousel.childNodes.length < 2) {
      nextBtn.style.opacity = 0
    }
  }


  prevBtn.style.opacity = 0

  nextBtn.addEventListener('click', (event) => {
    const idx = parseInt(carousel.dataset.newsid) + 1
    if (idx >= carousel.childNodes.length) return
    const percentage = (window.screen.availWidth > 1024) ? 50 : 100
    carousel.style.left = `${-percentage*idx}%`
    carousel.dataset.newsid = idx
    if (idx === 1) {
      toggleButton(prevBtn)
    }
    const offset = (window.screen.availWidth > 1024) ? 2 : 1
    if (idx === carousel.childNodes.length - offset) {
      toggleButton(nextBtn)
    }
  })

  prevBtn.addEventListener('click', (event) => {
    const idx = parseInt(carousel.dataset.newsid) - 1
    if (idx < 0) return
    const percentage = (window.screen.availWidth > 1024) ? 50 : 100
    carousel.style.left = `${-percentage*idx}%`
    carousel.dataset.newsid = idx
    if (idx === 0) {
      toggleButton(prevBtn)
    }
    const offset = (window.screen.availWidth > 1024) ? 2 : 1
    if (idx === carousel.childNodes.length - 1 -offset) {
      toggleButton(nextBtn)
    }
  })

  msToTimeAgo = (ms) => {
    const seconds = ms/1000
    const minute = 60
    const hour = minute*60
    const day = hour*24
    const week = day*7
    const month = week*4
    const year = month*12
    let str = ''
    let unit = -1
    if (seconds < minute) {
      unit = Math.round(seconds)
      str = unit+((unit === 1) ? ' second' : ' seconds')
      return str
    } else if (seconds < hour) {
      unit = Math.round(seconds/minute)
      str = unit+((unit === 1) ? ' minute' : ' minutes')
      return str
    } else if (seconds < day) {
      unit = Math.round(seconds/hour)
      str = unit+((unit === 1) ? ' hour' : ' hours')
      return str
    } else if (seconds < week) {
      unit = Math.round(seconds/day)
      str = unit+((unit === 1) ? ' day' : ' days')
      return str
    } else if (seconds < month) {
      unit = Math.round(seconds/week)
      str = unit+((unit === 1) ? ' week' : ' weeks')
      return str
    } else if (seconds < year) {
      unit = Math.round(seconds/month)
      str = unit+((unit === 1) ? ' month' : ' months')
      return str
    } else {
      unit = Math.round(seconds/year)
      str = unit+((unit === 1) ? ' year' : ' years')
      return str
    }
  }

  handleDate = (article) => {
    const deltaTime = now - article.dataset.timestamp
    const timeAgo = msToTimeAgo(deltaTime)
    const date = article.querySelector('.date')
    date.innerHTML = timeAgo + ' ago'
  }

  populateModal = (html, wide=false) => {
    const content = modal.querySelector('.content')
    content.innerHTML = ""
    content.innerHTML += `<i class='close fas fa-times'></i>`
    content.innerHTML += html
    modal.classList.add('show')
    if (wide) {
      modal.classList.add('wide')
    }
    document.body.style.overflow = 'hidden'
    content.querySelector('i').addEventListener('click', (event) => {
      document.body.style.overflow = 'auto'
      modal.classList.remove('show')
      modal.classList.remove('wide')
    })
  }

  handleContent = (article) => {
    const id = article.dataset.id
    const content = article.querySelector('.main')
    const text = content.innerText
    let limit = 250
    const regex = />(?:(?<t>[^<]*))/gm
    if (text.length > limit) {
      let area = content.innerHTML.substr(0, limit)
      content.innerHTML = area+"..."
      const div = document.createElement('div')
      div.classList.add('read-more')
      content.appendChild(div)
      div.innerHTML = `<a href='#'>Read More <i class='fas fa-arrow-right'></i></a>`
      const anchor = document.querySelector('.read-more a')
      anchor.addEventListener('click', (event) => {
        event.preventDefault()
        doJSONRequest('GET', '/news/'+id, {}, null).then(response => {
          if (response.status !== 200) { return }
          const html = templates.article({news: response.article})
          populateModal(html);
          const content = modal.querySelector('.content')
          handleDate(content.querySelector('article'))
        })
      })
    }
  }

  const modal = document.getElementById('modal')
  document.body.onclick = (event) => {
    document.body.style.overflow = 'auto'
    console.log(event.target)
    const content = modal.querySelector('.content')
    if (!(content.contains(event.target))) {
      modal.classList.remove('show')
      modal.classList.remove('wide')
    }
  }

  const articles = document.querySelectorAll('.news .carousel-item')
  const now = Date.now()
  articles.forEach(article => {
    handleDate(article)
    handleContent(article)
  })

  const screenshots = document.querySelectorAll('.screenshots .screenshot')
  screenshots.forEach(screenshot => {
    screenshot.addEventListener('click', (event) => {
      const id = screenshot.dataset.id
      doJSONRequest('GET', '/screenshot/'+id, {}, null).then(response => {
        const { screenshot } = response
        const html = `<div class='container'>${templates.screenshot({ screenshot })}</div>`
        populateModal(html, true)
      })
    })
  })

}());
