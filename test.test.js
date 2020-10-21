// import { fireEvent, getByText, getByDisplayValue } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import { TestHelper } from './test-helpers.js'

let h
let container

describe('The index page', () => {
  beforeEach((done) => {
    // Constructing a new JSDOM with this option is the key
    // to getting the code in the script tag to execute.
    // This is indeed dangerous and should only be done with trusted content.
    // https://github.com/jsdom/jsdom#executing-scripts
    const url = 'http://localhost:9292'

    const options = {
      resources: 'usable',
      runScripts: 'dangerously'
    }

    JSDOM.fromURL(url, options).then((dom) => {
      setTimeout(() => {
        container = dom.window.document
        // eslint-disable-next-line no-unused-vars
        h = new TestHelper(container)
        done()
      }, 500)
    })
  })

  it('has a body', () => {
    expect(container.querySelector('body')).not.toBeNull()
  })

  it('has a header', () => {
    expect(container.querySelector('header')).not.toBeNull()
  })

  it('contains a valid header', () => {
    expect(container.querySelector('header input')).not.toBeNull()
    expect(container.querySelector('header a')).not.toBeNull()
    expect(container.querySelector('header .github')).not.toBeNull()
  })

  // it('has spades, clubs, hearts and diams 2', () => {
  //   expect(h.cardIsPresent("♣2")).toBeTruthy();
  //   expect(h.cardIsPresent("♠2")).toBeTruthy();
  //   expect(h.cardIsPresent("♥2")).toBeTruthy();
  //   expect(h.cardIsPresent("♦2")).toBeTruthy();
  // })

  // it('has a card', () => {
  //   expect(container.querySelector('article')).not.toBeNull();
  // })

  // test('snapshot of main', () => {
  //   expect(container.querySelector('main').innerHTML).toMatchSnapshot();
  // })
})
