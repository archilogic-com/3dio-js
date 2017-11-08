import getDefaultsByType from './validate/get-defaults-by-type.js'

var ErrorCodes = {
  OK: 0,
  MIN_VALUE: 1,
  MAX_VALUE: 2,
  MISSED: 3,
  NOT_SUPPOPRTED: 4,
  VALUE: 5,
  TYPE: 6,
  CHILDREN_TYPE: 7
}

var typeSpecificValidations = getDefaultsByType()

// methods

function validateSceneStructure (elements3d) {

  var result = {
    isValid: true,
    validatedSceneStructure: null,
    warnings: [],
    errors: []
  }

  // model structure can be a sole element or array of element
  // make sure we return the same type
  var inputIsArray = Array.isArray(elements3d)
  // start recursive validation
  var validatedSceneStructure = validateElements3d(result, inputIsArray ? elements3d : [elements3d])
  // add result to in corresponding input type
  result.validatedSceneStructure = inputIsArray ? validatedSceneStructure : validatedSceneStructure[0]

  return Promise.resolve(result)

}

function validateElements3d (result, sourceElements3d, parentType) {
  var validatedElements3d = []

  sourceElements3d.forEach(function (sourceElement3d) {

    // validate if children types are correct
    if (parentType) {
      var validChild = typeSpecificValidations[parentType].childrenTypes.indexOf(sourceElement3d.type) > -1
      if (!validChild)  {
        result.isValid = false
        var message = '"' + sourceElement3d.type + '" is invalid child for "' + parentType + '"'
        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.CHILDREN_TYPE})
        return
      }
    }

    if (!sourceElement3d || !sourceElement3d.type) {
      // missing type param => invalid
      result.isValid = false
      var message = 'Missing "type" parameter'
      result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.TYPE})
      return
    } else if (!typeSpecificValidations[sourceElement3d.type]) {
      // missing type validation (typ not supported) => invalid
      result.isValid = false
      var message = 'Parameter "type" of value "'+sourceElement3d.type+'" is not supported'
      result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.NOT_SUPPOPRTED})
      return
    }

    var validatedElement3d = {}
    var passedValidations = validateParams(result, typeSpecificValidations[sourceElement3d.type], sourceElement3d, validatedElement3d)

    // if element passed validations...
    if (passedValidations) {

      // add to array
      validatedElements3d.push(validatedElement3d)

      // parse children
      if (validatedElement3d.children && validatedElement3d.children.length) {
        validatedElement3d.children = validateElements3d(result, validatedElement3d.children, validatedElement3d.type)
      }

    }

  })

  return validatedElements3d
}

function validateParams (result, validations, sourceElement3d, validatedElement3d) {

  var isValid = true

  // iterate through param validations and copy valid params from source to validated element
  Object.keys(validations.params).sort().forEach(function (paramName) {
    var v = validations.params[paramName]
    var value = sourceElement3d[paramName]

    if (value !== undefined) {

      // check type
      var paramValueType = getParamValueType(value)
      if (v.type !== paramValueType) {
        isValid = false
        var message = 'Parameter "' + paramName + '" is of type "' + paramValueType + '" but should be type "' + v.type + '"'
        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.TYPE})
        return
      }

      // check if value allowed
      if (v.possibleValues !== undefined && v.possibleValues.indexOf(value) === -1) {
        isValid = false
        var message = 'Parameter "' + paramName + '" has value "' + value + '" but should be one of: ' + JSON.stringify(v.possibleValues)
        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.VALUE})
        return
      }

      // check if above min
      if (v.min !== undefined && (v.type === 'number' && value <= v.min)) {
        isValid = false
        var message = 'Parameter "' + paramName + '" has value ' + value + ' which is below allowed minimum of ' + v.min
        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.MIN_VALUE})
        return
      }

      // check if below max
      if (v.max !== undefined && (v.type === 'number' && value >= v.max)) {
        isValid = false
        var message = 'Parameter "' + paramName + '" has value ' + value + ' which is above allowed maximum of ' + v.max
        result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.MAX_VALUE})
        return
      }

      // everything ok: assign value to validated object
      validatedElement3d[paramName] = value

    } else if (!v.optional) {
      // param not set but mandatory

      isValid = false
      var message = 'Parameter "' + paramName + '" is mandatory but not set'
      result.errors.push({message: message, item: sourceElement3d, code: ErrorCodes.MISSED})
      return

    }

  })

  // check for unexpected params
  Object.keys(sourceElement3d).forEach(function (paramName) {
    if (!validations.params[paramName]) {
      var message = 'Parameter "' + paramName + '" is not supported and will be ignored'
      result.warnings.push({message: message, item: sourceElement3d, code: ErrorCodes.NOT_SUPPOPRTED})
    }
  })

  if (!isValid) result.isValid = false
  return isValid

}

function getParamValueType (value) {
  if (Array.isArray(value)) {
    // TODO: add support for more sophisticated array types
    // array-with-objects, array-with-numbers, array-with-arrays-with-numbers
    return 'array'
  } else {
    return typeof value
  }
}

// public API methods

export default validateSceneStructure
