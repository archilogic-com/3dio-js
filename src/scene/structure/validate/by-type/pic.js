export default {
    description: 'parametric picture frame',
    params: {
        h: {
            type: 'number',
            defaultValue: 1.5,
            optional: false,
            description: 'Vertical position'
        },
        picture: {
            type: 'string',
            defaultValue: '',
            optional: true,
            description: 'picture'
        },
        picType: {
            type: 'string',
            defaultValue: 'framed',
            optional: false,
            possibleValues: ['poster', 'framed', 'canvas'],
            description: 'picture frame style'
        },
        picFormat: {
            type: 'string',
            defaultValue: 'portrait',
            optional: false,
            possibleValues: ['portrait', 'panorama'],
            description: 'picture orientation'
        },
        frameMat: {
            type: 'string',
            defaultValue: 'white',
            possibleValues: ['white', 'black'],
            optional: false,
            description: 'frame color'
          },
        frameLength: {
            type: 'number',
            defaultValue: 0.015,
            optional: true,
            description: 'relative scale of source file to 1 meter'
        },
        frameWidth: {
            type: 'number',
            defaultValue: 0.03,
            optional: true,
            description: 'flip Y and Z Axis'
        },
        picSize: {
            type: 'number',
            defaultValue: 0.9,
            optional: true,
            description: 'flip Y and Z Axis'
        },
        mat: {
            type: 'number',
            defaultValue: 0.04,
            optional: true,
            description: 'pic boundary'
        }
    },
    childrenTypes: [],
    parentTypes: ['level', 'group'],
    aframeComponent: {
        name: 'io3d-data3d'
    }
}