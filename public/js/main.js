function QS(element,target) {
  return element.querySelector(target)
}

function QSA(element,target) {
  return element.querySelectorAll(target)
}

function cloneTemplate(templateID, templateContent) {
  let template = QS(document,templateID)    
  let clone = template.content.cloneNode(true)
  return QS(clone,templateContent)
}

function resetWrapper() {QS(document, `.wrapper`).innerHTML = ``}

function appendToWrapper(listOfElements) {
  let wrapper = QS(document, `.wrapper`)
  listOfElements.forEach(element => {wrapper.appendChild(element)})
}

function generateRepoCard(repoList) {
  let cardTemplate = cloneTemplate(`#repoCardTemplate`, `.card`)
  let cardList = []
  repoList.forEach(repo => {
    let card = cardTemplate.cloneNode(true)
    let repoForks = QS(card, `.repoForks`)
    repoForks.setAttribute(`repoFullName`, repo.fullName)
    repoForks.addEventListener(`click`, tempfunction)
    QS(card, `.repoName`).innerText = repo.name
    QS(card, `.repoGHLink`).href = repo.GHLink
    QS(card, `.repoNumberOfForks`).innerText = repo.numberOfForks
    cardList.push(card)   
  })
return cardList
}