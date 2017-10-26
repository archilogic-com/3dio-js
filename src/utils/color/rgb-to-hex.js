export default function rgbToHex(array) {
  return "#" + ((1 << 24) + (Math.round(array[0]*255) << 16) + (Math.round(array[1]*255) << 8) + (Math.round(array[2]*255))).toString(16).slice(1)
}