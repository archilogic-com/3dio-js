import readFile from './read.js'
import md5 from '../math/md5.js'

export default function getMd5Hash (file) {
  return readFile(file, 'binaryString').then(md5)
}