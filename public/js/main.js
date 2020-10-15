function QS (element, target) {
  return element.querySelector(target)
}

function QSA (element, target) {
  return element.querySelectorAll(target)
}

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

function generateRepoCard (repoList) {
  const cardTemplate = cloneTemplate('#repoCardTemplate', '.card')
  const cardList = []
  repoList.forEach(repo => {
    const card = cardTemplate.cloneNode(true)
    const repoForks = QS(card, '.repoForks')
    repoForks.setAttribute('repoFullName', repo.fullName)
    repoForks.addEventListener('click', tempfunction)
    QS(card, '.repoName').innerText = repo.name
    QS(card, '.repoGHLink').href = repo.GHLink
    QS(card, '.repoNumberOfForks').innerText = repo.numberOfForks
    cardList.push(card)
  })
  return cardList
}

async function fetchJSON (url) {
  try {
    const temp = await fetch(url)
    const response = await temp.json()
    return response
  } catch (error) {
    return `The following error message was returned: ${error}`
  }
}

async function getRepos (userName) { return await fetchJSON(`/api/github/${userName}/repos`) }

async function getForks (userRepo) { return await fetchJSON(`/api/github/${userRepo}/forks`) }
