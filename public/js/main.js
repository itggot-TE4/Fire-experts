QS(document, '#for').addEventListener('submit', async (e) => {
  e.preventDefault()
  const input = e.target.querySelector('input').value
  const data = await getRepos(input)
  if (data.message === 'Not Found') {
    alert('No user with that name boy!')
    return null
  } else if (typeof data === 'string') {
    alert('Connection to server was terminated.')
    return null
  }
  const parseRepo = parseRepoData(data)
  const repoCards = generateRepoCards(parseRepo)
  resetWrapper()
  appendToWrapper(repoCards)
})

function QS (element, target) {
  return element.querySelector(target)
}

// function QSA (element, target) {
//   return element.querySelectorAll(target)
// }

function cloneTemplate (templateID, templateContent) {
  const template = QS(document, templateID)
  const clone = template.content.cloneNode(true)
  return QS(clone, templateContent)
}

function resetWrapper () { QS(document, '.wrapper').innerHTML = '' }

function appendToWrapper (listOfElements) {
  const wrapper = QS(document, '.wrapper')
  listOfElements.forEach(element => { wrapper.appendChild(element) })
}

function parseRepoData (repoData) {
  const parsedData = []
  repoData.forEach(repo => {
    const parsedRepo = {
      name: `${repo.name}`,
      fullName: `${repo.full_name}`,
      GHLink: `${repo.html_url}`,
      numberOfForks: `${repo.forks}`
    }
    parsedData.push(parsedRepo)
  })
  return parsedData
}

function generateRepoCards (repoList) {
  const cardTemplate = cloneTemplate('#repoCardTemplate', '.card')
  const cardList = []
  repoList.forEach(repo => {
    const card = cardTemplate.cloneNode(true)
    const repoForks = QS(card, '.repoForks')
    repoForks.setAttribute('data-repo-full-name', repo.fullName)
    repoForks.addEventListener('click', showForks)
    QS(card, '.repoName').textContent = repo.name
    QS(card, '.repoGHLink').href = repo.GHLink
    QS(card, '.repoNumberOfForks').textContent = repo.numberOfForks
    cardList.push(card)
  })
  return cardList
}

async function showForks (e) {
  const fullName = e.target.getAttribute('data-repo-full-name')
  const data = await getForks(fullName)
  renderForkCards(data)
}

async function fetchJSON (url) {
  try {
    const temp = await fetch(url)
    const response = await temp.json()
    if (temp.status !== 200) {
      const message = `The server responded with a status code of ${temp.status}`
      console.log(message)
      return message
    }
    return response
  } catch (error) {
    const message = `The following error message was returned: ${error}`
    console.log(message)
    return message
  }
}

async function getRepos (userName) { return await fetchJSON(`/api/github/${userName}/repos`) }

async function getForks (userRepo) { return await fetchJSON(`/api/github/${userRepo}/forks`) }

function loadForkCard (forkCard) {
  appendToWrapper([forkCard])
  loadSyntaxHighlighting(QS(forkCard, 'pre code'))
}

function renderForkCardContent (cardTemplate, forkData, manifest, codeSnippet) {
  QS(cardTemplate, 'h3').textContent = forkData.full_name
  QS(cardTemplate, 'code').textContent = codeSnippet
  QS(cardTemplate, 'code').classList.add(manifest.language)
  QS(cardTemplate, '.forkGHLink').href = forkData.html_url
  QS(cardTemplate, 'form').addEventListener('submit', commentSubmit)
}

function generateForkCardTestResults (_manifest, _codeSnippet) {
  const testResults = []
  for (let i = 0; i < 3; i++) {
    const testResult = document.createElement('p')
    testResult.textContent = `fake test result number ${i}`
    testResults.push(testResult)
  }
  return testResults
}

function renderForkCardTestResults (card, _manifest, _codeSnippet) {
  const testResults = generateForkCardTestResults(_manifest, _codeSnippet)
  testResults.forEach(testResult => {
    QS(card, '.testResults').appendChild(testResult)
  })
}

async function renderForkCards (forkList) {
  resetWrapper()
  const cardTemplate = cloneTemplate('#forkCardTemplate', '.card')
  await forkList.forEach(async fork => {
    const card = cardTemplate.cloneNode(true)
    const manifest = await getManifest(fork.full_name, fork.default_branch)
    let codeSnippet = await getCodeSnippet(fork.full_name, fork.default_branch)
    if (typeof manifest.language === 'string' || typeof manifest.filePath === 'string') {
      if (codeSnippet === '404: Not Found') {
        codeSnippet = 'No code here!\nThe given manifest.filePath returned no file.'
      }
      renderForkCardTestResults(card)
      renderForkCardContent(card, fork, manifest, codeSnippet)
      loadForkCard(card)
    }
  })
}

async function getManifest (forkFullName, branch = 'master') {
  return await fetchJSON(`https://raw.githubusercontent.com/${forkFullName}/${branch}/.manifest.json`)
}

async function getCodeSnippet (forkFullName, branch = 'master') {
  const manifest = await getManifest(forkFullName)
  const codeSnippetPromise = await fetch(`https://raw.githubusercontent.com/${forkFullName}/${branch}/${manifest.filePath}`)
  const codeSnippet = await codeSnippetPromise.text()
  codeSnippet.trim()

  return codeSnippet
}

function loadSyntaxHighlighting (card) {
  // eslint-disable-next-line no-undef
  hljs.highlightBlock(card)
}

// A function that takes the target element and appends it to the comment section
function commentSubmit (e) {
  const commentList = e.target.parentElement.querySelector('.forkform')
  e.preventDefault()
  const com = QS(e.target, 'input').value
  localStorage.setItem('comment', com)
  const render = localStorage.getItem('comment')
  const comment = document.createElement('p')
  comment.textContent = render
  commentList.parentElement.insertBefore(comment, commentList)
}
