document.querySelector('#for').addEventListener('submit', async (e) => {
  e.preventDefault()
  const input = e.target.querySelector('input').value
<<<<<<< HEAD
  const data = await getRepos(input)
  if (data.message === 'Not Found') {
    alert('No user with that name boy!')
    return null
  } else if (typeof data === 'string') {
    alert('Connection to server was terminated.')
=======
  let data
  let response
  try {
    response = await fetch(`/api/github/${input}/repos`)
    data = await response.json()
    return null
  } catch (error) { alert('Connection to server lost!') }
  if (data.message === 'Not Found' || response.status !== 200) {
    alert('No user with that name boy!')
>>>>>>> Added feauture, when input is given. Cards is generated
    return null
  }
  const parseRepo = parseRepoData(data)
  const repoCards = generateRepoCard(parseRepo)
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

function tempfunction (e) {
  console.log(e)
  console.log('this is temp function')
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

// async function getForks (userRepo) { return await fetchJSON(`/api/github/${userRepo}/forks`) }
