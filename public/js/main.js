// Shows the user a list of all public repositories belonging to the user they searched for
async function headerFormSubmit (e) {
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
}

// A helper for quicker use of querySelector()
function QS (element, target) {
  return element.querySelector(target)
}

// A helper for quicker use of querySelectorAll()
// function QSA (element, target) {
//   return element.querySelectorAll(target)
// }

// Creates a clone from a template specified in document
// templateContent is a container inside the template which contains all of the content
function cloneTemplate (templateID, templateContent) {
  const template = QS(document, templateID)
  const clone = template.content.cloneNode(true)
  return QS(clone, templateContent)
}

// Clears all content from the wrapper
function resetWrapper () { QS(document, '.wrapper').innerHTML = '' }

// Appends a list of elements to the "wrapper"-element
function appendToWrapper (listOfElements) {
  const wrapper = QS(document, '.wrapper')
  listOfElements.forEach(element => { wrapper.appendChild(element) })
}

// Parses data returned by the GitHub API into a JS object for use in generateRepoCards()
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

// Generates card for every public repository belonging to a previously determined user (needs input from parseRepoData())
function generateRepoCards (repoList) {
  const cardTemplate = cloneTemplate('#repoCardTemplate', '.card')
  const cardList = []
  repoList.forEach(repo => {
    const card = cardTemplate.cloneNode(true)
    const repoForks = QS(card, '.repoForks')
    repoForks.setAttribute('data-repo-full-name', repo.fullName)
    repoForks.addEventListener('click', showForks)
    verifyRepoManifest(card, repo.fullName)

    QS(card, '.repoName').textContent = repo.name
    QS(card, '.repoGHLink').href = repo.GHLink
    QS(card, '.repoNumberOfForks').textContent = repo.numberOfForks
    cardList.push(card)
  })
  return cardList
}

// Given a card it verifies if the card contains a .manifest.json file and
// adds a disabled-card class if there is no file in the repo
async function verifyRepoManifest (card, fullName) {
  const manifest = await getManifest(fullName)
  if (manifest.includes('The following error message was returned')) {
    card.classList.add('disabled-card')
  }
}

// shows all forks for a given GitHub repository
async function showForks (e) {
  const fullName = e.target.getAttribute('data-repo-full-name')
  const data = await getForks(fullName)
  forkCards(data)
}

// Fetches and parses JSON data from a given URL
// If this fails, it logs an error message in the console
async function fetchJSON (url) {
  QS(document, '.progress').classList.remove('hide')
  try {
    const temp = await fetch(url)
    const response = await temp.json()
    if (temp.status !== 200) {
      const message = `The server responded with a status code of ${temp.status}`
      console.log(message)
      QS(document, '.progress').classList.add('hide')
      return message
    }
    QS(document, '.progress').classList.add('hide')
    return response
  } catch (error) {
    const message = `The following error message was returned: ${error}`
    console.log(message)
    QS(document, '.progress').classList.add('hide')
    return message
  }
}

// Gets all public GitHub repositories for a given user
async function getRepos (userName) { return await fetchJSON(`/api/github/${userName}/repos`) }

// Gets all forks from a given GitHub users repository
async function getForks (userRepo) { return await fetchJSON(`/api/github/${userRepo}/forks`) }

// takes a forkCard that has been run through renderForkCardContent and appends it to the wrapper
// also highlights the syntax of any present codeSnippet
function renderForkCard (forkCard) {
  appendToWrapper([forkCard])
  loadSyntaxHighlighting(QS(forkCard, 'pre code'))
}

// renders the content inside a forkCard
function renderForkCardContent (cardTemplate, forkData, manifest, codeSnippet) {
  QS(cardTemplate, 'h3').textContent = forkData.full_name
  QS(cardTemplate, 'code').textContent = codeSnippet
  renderForkCardTestResults(cardTemplate, manifest, codeSnippet)
  QS(cardTemplate, 'code').classList.add(manifest.language)
  QS(cardTemplate, '.forkGHLink').href = forkData.html_url
  QS(cardTemplate, 'form').addEventListener('submit', commentSubmit)
}

// Generates the test functions argument list as a string
function generateTestFunctionArguments (args) {
  let str = ''
  args.forEach((e) => {
    str += `${e}, `
  })
  return str.substring(0, str.lastIndexOf(','))
}

// generates forkCard test results as a list of iframes
function generateForkCardTestResults (manifest, codeSnippet) {
  if (manifest.language.toLowerCase() !== 'javascript') {
    const x = document.createElement('p')
    x.textContent = 'Unsupported language'
    return [x]
  }
  const list = generateForkCardTestScript(manifest)
  const iframes = generateForkCardTestBody(list, codeSnippet)
  return iframes
}

// Generates a list of iframes in witch the test result are rendered
function generateForkCardTestBody (list, codeSnippet) {
  const iframes = []
  list.forEach((e) => {
    const ifrm = document.createElement('iframe')
    const html = `<!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Document</title>
    </head>
    <body>
      <script>${codeSnippet}</script>
      ${e}
    </body>
    </html>`
    ifrm.setAttribute('srcdoc', html)
    iframes.push(ifrm)
  })
  return iframes
}

// Genereates the script tag that runs the tests and appends the result to body
function generateForkCardTestScript (manifest) {
  const list = []
  manifest.tests.forEach(e => {
    for (let i = 0; i < e.arguments.length; i += e.arguments[0].length) {
      list.push(`<script>
      let str;
      try {
        if(${manifest.functionName}(${generateTestFunctionArguments(e.arguments)}) == ${e.expected}){
          str = "passed"; 
        } else {
          str = "failed";
        };
      } catch {
        str = "failed";
      }
      document.querySelector('body').innerHTML = "Test ${e.description}: " + str
      </script>`)
    }
  })
  return list
}

// renders forkCard test results inside a given forkCard
function renderForkCardTestResults (card, manifest, codeSnippet) {
  const testResults = generateForkCardTestResults(manifest, codeSnippet)
  testResults.forEach(testResult => {
    QS(card, '.testResults').appendChild(testResult)
  })
}

// resets wrapper and then generates and renders forkCards from a list of forks from a GitHub repository
async function forkCards (forkList) {
  resetWrapper()
  const cardTemplate = cloneTemplate('#forkCardTemplate', '.card')
  // asynchroically renders each forkCard
  await forkList.forEach(async fork => {
    const card = cardTemplate.cloneNode(true)
    // gets .manifest.json
    const manifest = await getManifest(fork.full_name, fork.default_branch)
    // gets code from file specified in .manifest.json
    let codeSnippet = await getCodeSnippet(fork.full_name, fork.default_branch)
    if (typeof manifest.language === 'string' || typeof manifest.filePath === 'string') {
      if (codeSnippet === '404: Not Found') {
        codeSnippet = 'No code here!\nThe given manifest.filePath returned no file.'
      }
      renderForkCardContent(card, fork, manifest, codeSnippet)
      renderForkCard(card)
    }
  })
}

// Gets .manifest.json from a given fork
async function getManifest (forkFullName, branch = 'master') {
  return await fetchJSON(`https://raw.githubusercontent.com/${forkFullName}/${branch}/.manifest.json`)
}

// Fetches a codeSnippet for a given fork
async function getCodeSnippet (forkFullName, branch = 'master') {
  const manifest = await getManifest(forkFullName)
  // Gets the raw file content from a path provided in .manifest.json
  const codeSnippetPromise = await fetch(`https://raw.githubusercontent.com/${forkFullName}/${branch}/${manifest.filePath}`)
  const codeSnippet = await codeSnippetPromise.text()
  codeSnippet.trim()

  return codeSnippet
}

// Loads syntax highlighting for a card's codeSnippet using hljs (https://highlightjs.org/usage/)
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

async function initializer () {
  // Adds an eventlistener to the header, allowing the user to search for a GitHub user
  QS(document, '#for').addEventListener('submit', headerFormSubmit)

  const data = await fetchJSON('/api/github/user')
  console.log(data)
  if (data.message !== 'Bad credentials') {
    QS(QS(document, '#for'), 'input').value = data.login
    QS(document, '#for').dispatchEvent(new Event('submit'))
    QS(QS(document, '#for'), 'input').value = ''
  }
}

initializer()

if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
  module.exports = {
    generateTestFunctionArguments: generateTestFunctionArguments,
    generateForkCardTestScript: generateForkCardTestScript
  }
}
