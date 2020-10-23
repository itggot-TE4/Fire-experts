// import { fireEvent, getByText, getByDisplayValue } from '@testing-library/dom'
import '@testing-library/jest-dom/extend-expect'
import { JSDOM } from 'jsdom'
import { TestHelper } from './test-helpers.js'

import x from './public/js/main'

let h
let container

const manifest = {
  assignmentName: 'Smallest of Two',
  filePath: 'lib/smallest_of_two.js',
  language: 'javascript',
  functionName: 'smallestOfTwo',
  functionParameters: ['num1', 'num2'],
  functionSpan: [2, 8],
  tests: [
    {
      description: 'First is smallest',
      arguments: [1, 2],
      expected: 1
    },
    {
      description: 'Second is smallest',
      arguments: [2, 1],
      expected: 1
    },
    {
      description: 'Same size',
      arguments: [2, 2],
      expected: 2
    }
  ]
}

xdescribe('page', () => {
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

  it('contains a valid header', () => {
    expect(container.querySelector('header')).not.toBeNull()
    expect(container.querySelector('header input')).not.toBeNull()
    expect(container.querySelector('header a')).not.toBeNull()
    expect(container.querySelector('header .github')).not.toBeNull()
  })
})

describe('index.js', () => {
  it('generates test function arguments', () => {
    expect(x.generateTestFunctionArguments([1, 2, 3])).not.toBeNull()
    expect(x.generateTestFunctionArguments([1, 2, 3])).toEqual('1, 2, 3')
    expect(x.generateTestFunctionArguments(['potatis', 2, null])).toEqual('potatis, 2, null')
  })

  it('generates fork card test scripts', () => {
    expect(x.generateForkCardTestScript(manifest)).not.toBeNull()
    expect(x.generateForkCardTestScript(manifest)[0].replace(/([\s])+/g, '')).toEqual(`<script>
    let str; try {
      if(smallestOfTwo(1, 2) == 1){ str = "passed";
      } else { str = "failed"; };
    } catch { str = "failed"; }
    document.querySelector('body').innerHTML = "Test First is smallest: " + str
    </script>`.replace(/([\s])+/g, ''))
  })
})
