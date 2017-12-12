export default function getParamValueType (value, target) {
  if (target === 'int' && isInt(value)) {
    return 'int'
  }
  if (Array.isArray(value)) {
    // TODO: add support for more sophisticated array types
    // array-with-objects, array-with-numbers, array-with-arrays-with-numbers
    return 'array'
  } else {
    return typeof value
  }
}

function isInt(value) {
  return !isNaN(value) &&
    parseInt(Number(value)) == value &&
    !isNaN(parseInt(value, 10));
}