// Fetch Techmeme RSS feed
export async function getTechmemeNews() {
  try {
    // Use corsproxy.io as it's more reliable
    const response = await fetch('https://corsproxy.io/?' + encodeURIComponent('https://www.techmeme.com/feed.xml'))

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const text = await response.text()
    const parser = new DOMParser()
    const xml = parser.parseFromString(text, 'text/xml')

    const items = xml.querySelectorAll('item')
    const news = []

    items.forEach((item, index) => {
      if (index < 20) { // Get top 20 stories
        const title = item.querySelector('title')?.textContent || ''
        const link = item.querySelector('link')?.textContent || ''
        const description = item.querySelector('description')?.textContent || ''
        const pubDate = item.querySelector('pubDate')?.textContent || ''

        // Extract domain from link
        let domain = ''
        try {
          domain = new URL(link).hostname.replace('www.', '')
        } catch (e) {
          domain = 'techmeme.com'
        }

        news.push({
          title,
          link,
          description: stripHtml(description),
          domain,
          pubDate: formatDate(pubDate),
        })
      }
    })

    return news
  } catch (error) {
    console.error('Error fetching Techmeme:', error)
    return []
  }
}

function stripHtml(html) {
  const tmp = document.createElement('div')
  tmp.innerHTML = html
  return tmp.textContent || tmp.innerText || ''
}

function formatDate(dateStr) {
  const date = new Date(dateStr)
  const now = new Date()
  const diffMs = now - date
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)

  if (diffMins < 60) {
    return `${diffMins}m ago`
  } else if (diffHours < 24) {
    return `${diffHours}h ago`
  } else {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }
}
