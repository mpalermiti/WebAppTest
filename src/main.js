import './style.css'
import { getTechmemeNews } from './techmeme.js'

const app = document.querySelector('#app')

// Show loading state
app.innerHTML = `
  <div class="news-container">
    <h1 class="page-title">Latest tech news</h1>
    <div class="loading">Loading latest tech news...</div>
  </div>
`

// Load news
async function loadNews() {
  const container = document.querySelector('.news-container')
  const news = await getTechmemeNews()

  if (news.length === 0) {
    const existingError = container.querySelector('.error')
    if (!existingError) {
      container.innerHTML += '<div class="error">Failed to load news. Retrying...</div>'
    }
    return
  }

  const newsGrid = document.createElement('div')
  newsGrid.className = 'news-grid'

  news.forEach((item, index) => {
    const cardType = (index % 8) + 1
    const card = document.createElement('div')
    card.className = `news-card card-type-${cardType}`
    card.dataset.link = item.link
    card.style.animationDelay = `${index * 0.05}s`

    // Common header
    const header = `
      <div class="news-card-header">
        <span class="option-badge">Option ${cardType}</span>
        <span class="news-source">${item.domain}</span>
        <span class="news-time">${item.pubDate}</span>
      </div>
      <h3 class="news-title">${item.title}</h3>
    `

    switch(cardType) {
      case 1: // Expandable
        card.innerHTML = `
          ${header}
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <div class="expand-content">
            <p class="full-description">${item.description || ''}</p>
            <p class="ai-summary"><strong>Quick take:</strong> ${item.description ? item.description.substring(0, 150) : ''}</p>
            <a href="${item.link}" target="_blank" class="read-link">Read full article →</a>
          </div>
          <button class="expand-btn">Expand ▼</button>
        `
        break

      case 2: // Hover peek
        card.innerHTML = `
          ${header}
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <div class="hover-peek">
            <div class="reading-time">⏱ 3 min read</div>
            <div class="quick-actions">
              <button class="action-btn">🔖 Save</button>
              <button class="action-btn">🔗 Share</button>
              <a href="${item.link}" target="_blank" class="action-btn">📖 Read</a>
            </div>
          </div>
        `
        break

      case 3: // Slide-in panel
        card.innerHTML = `
          ${header}
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <button class="preview-btn">Preview →</button>
        `
        card.dataset.description = item.description
        break

      case 4: // Long-press preview
        card.innerHTML = `
          ${header}
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <div class="longpress-hint">Press & hold to preview</div>
          <div class="preview-overlay">
            <div class="preview-content">
              <h4>${item.title}</h4>
              <p>${item.description || ''}</p>
              <a href="${item.link}" target="_blank">Read article →</a>
            </div>
          </div>
        `
        break

      case 5: // Swipe actions
        card.innerHTML = `
          <div class="swipe-actions-left">
            <div class="swipe-action bookmark">🔖 Bookmark</div>
          </div>
          <div class="swipe-actions-right">
            <div class="swipe-action share">🔗 Share</div>
          </div>
          <div class="card-content">
            ${header}
            <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
            <div class="swipe-hint">← Swipe left or right →</div>
          </div>
        `
        break

      case 6: // Reading time
        card.innerHTML = `
          ${header}
          <div class="reading-meta">
            <span class="read-time">⏱ 3 min read</span>
            <span class="progress">Progress: 0%</span>
          </div>
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <a href="${item.link}" target="_blank" class="read-link">Read article →</a>
        `
        break

      case 7: // Related stories
        card.innerHTML = `
          ${header}
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <div class="related-popover">
            <div class="related-title">Related Stories:</div>
            <div class="related-item">• AI regulation updates</div>
            <div class="related-item">• Tech company layoffs</div>
            <div class="related-item">• Industry analysis</div>
          </div>
          <a href="${item.link}" target="_blank" class="read-link">Read article →</a>
        `
        break

      case 8: // Quick actions toolbar
        card.innerHTML = `
          ${header}
          <p class="news-description">${item.description ? item.description.substring(0, 100) + '...' : ''}</p>
          <div class="actions-toolbar">
            <button class="toolbar-btn">🔖</button>
            <button class="toolbar-btn">🔗</button>
            <button class="toolbar-btn">💾</button>
            <a href="${item.link}" target="_blank" class="toolbar-btn">📖</a>
          </div>
        `
        break
    }

    newsGrid.appendChild(card)
  })

  const loading = container.querySelector('.loading')
  if (loading) loading.remove()

  const error = container.querySelector('.error')
  if (error) error.remove()

  const existingGrid = container.querySelector('.news-grid')
  if (existingGrid) existingGrid.remove()

  container.appendChild(newsGrid)

  // Add event listeners AFTER appending to DOM
  setupInteractions()
}

// Setup interactions
function setupInteractions() {
  // Option 1: Expandable
  document.querySelectorAll('.card-type-1 .expand-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const card = btn.closest('.news-card')
      card.classList.toggle('expanded')
      btn.textContent = card.classList.contains('expanded') ? 'Collapse ▲' : 'Expand ▼'
    })
  })

  // Option 3: Slide-in panel
  document.querySelectorAll('.card-type-3 .preview-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation()
      const card = btn.closest('.news-card')
      const panel = document.createElement('div')
      panel.className = 'slide-panel'
      panel.innerHTML = `
        <button class="close-panel">✕</button>
        <h2>${card.querySelector('.news-title').textContent}</h2>
        <p>${card.dataset.description}</p>
        <a href="${card.dataset.link}" target="_blank" class="read-link">Read full article →</a>
      `
      document.body.appendChild(panel)
      setTimeout(() => panel.classList.add('open'), 10)

      panel.querySelector('.close-panel').addEventListener('click', () => {
        panel.classList.remove('open')
        setTimeout(() => panel.remove(), 300)
      })
    })
  })

  // Option 4: Long-press
  document.querySelectorAll('.card-type-4').forEach(card => {
    let pressTimer
    card.addEventListener('mousedown', () => {
      pressTimer = setTimeout(() => {
        card.classList.add('show-preview')
      }, 500)
    })
    card.addEventListener('mouseup', () => {
      clearTimeout(pressTimer)
    })
    card.addEventListener('mouseleave', () => {
      clearTimeout(pressTimer)
      card.classList.remove('show-preview')
    })
  })

  // Option 5: Swipe
  document.querySelectorAll('.card-type-5').forEach(card => {
    let startX, currentX
    const content = card.querySelector('.card-content')

    content.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX
    })

    content.addEventListener('touchmove', (e) => {
      currentX = e.touches[0].clientX
      const diff = currentX - startX
      content.style.transform = `translateX(${diff}px)`
    })

    content.addEventListener('touchend', () => {
      const diff = currentX - startX
      if (Math.abs(diff) > 100) {
        card.classList.add(diff > 0 ? 'swiped-right' : 'swiped-left')
        setTimeout(() => {
          content.style.transform = ''
          card.classList.remove('swiped-right', 'swiped-left')
        }, 1500)
      } else {
        content.style.transform = ''
      }
    })

    // Mouse events for desktop
    let isDragging = false
    content.addEventListener('mousedown', (e) => {
      isDragging = true
      startX = e.clientX
      currentX = startX
    })

    document.addEventListener('mousemove', (e) => {
      if (!isDragging) return
      currentX = e.clientX
      const diff = currentX - startX
      content.style.transform = `translateX(${diff}px)`
    })

    document.addEventListener('mouseup', () => {
      if (!isDragging) return
      isDragging = false
      const diff = currentX - startX
      if (Math.abs(diff) > 100) {
        card.classList.add(diff > 0 ? 'swiped-right' : 'swiped-left')
        setTimeout(() => {
          content.style.transform = ''
          card.classList.remove('swiped-right', 'swiped-left')
        }, 1500)
      } else {
        content.style.transform = ''
      }
    })
  })

  // Option 6: Progress simulation
  document.querySelectorAll('.card-type-6 .read-link').forEach(link => {
    link.addEventListener('click', () => {
      const card = link.closest('.news-card')
      const progress = card.querySelector('.progress')
      let pct = 0
      const interval = setInterval(() => {
        pct += 10
        progress.textContent = `Progress: ${pct}%`
        if (pct >= 100) clearInterval(interval)
      }, 200)
    })
  })
}

// Initial load
loadNews()

// Auto-refresh every 5 minutes
setInterval(() => {
  loadNews()
}, 5 * 60 * 1000)
