import packageJson from '../../package.json'
import browserRuntime from './runtime/browser-only'

// detect environment
const isNode = (function(){
  // detect node environment
  return typeof module !== 'undefined'
  && module.exports
  && typeof process !== 'undefined'
  && Object.prototype.toString.call(process) === '[object process]'
})()

const isBrowser = (function(){
  return !isNode && typeof window !== 'undefined' && Object.prototype.toString.call(window) === '[object Window]'
})()

// helpers
function assertBrowser(message) {
  if (!isBrowser) throw (message || 'Sorry, this feature requires a browser environment.')
}

let browserInfo = {}
if (isBrowser) {
  browserInfo = browserRuntime()
}


// create runtime object
export default {

  isDebugMode: false,
  isNode: isNode,
  isBrowser: isBrowser,
  browser: browserInfo,
  assertBrowser:assertBrowser,
  /*
  libInfo: {
    npmName: packageJson.name,
    version: packageJson.version,
    homepage: packageJson.homepage,
    githubRepository: packageJson.repository,
    gitBranchName: GIT_BRANCH,
    gitCommitHash: GIT_COMMIT.substr(0, 7),
    buildDate: BUILD_DATE,
    license: packageJson.license
  }*/

};
