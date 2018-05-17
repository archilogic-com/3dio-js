import toData3d from '../../../src/scene/structure/to-data3d.js';
import materialLib from '../../../src/scene/structure/parametric-objects/common/material-lib.js'
import { isNaN } from 'lodash'
import applyDefaults from '../../../src/scene/structure/apply-defaults.js'

// workaround for JEST issue that causes async test failures not being
// displayed properly: https://github.com/facebook/jest/issues/3251
process.on('unhandledRejection', (reason) => {
  console.warn('UNHANDLED REJECTION', reason)
})


expect.extend({

  // we need this to loop through objects and test stuff on them and
  // then still see which specific object has invalid properties
  toSatisfy(received, comparator) {
    let pass = comparator(received)
    if (pass) {
      return {
        pass: true,
        message: () => typeof(received)+' '+JSON.stringify(received)+'\ndoes satisfy\n'+comparator,
      };
    } else {
      return {
        message: () => typeof(received)+' '+JSON.stringify(received)+'\ndoes not satisfy\n'+comparator,
        pass: false,
      };
    }
  },
});

test('sceneStructure->data3d material resolver', async () => {
  let mats = Object.keys(materialLib)
  mats.forEach( async function(mat) {
    let minimalSceneStruc = {
      type: "floor",
      materials: {
        top: mat
      }
    }
    let result = await toData3d(minimalSceneStruc)
    expect(result).toHaveProperty('data3d.materials.top', materialLib[mat].attributes)
  })
})

test('sceneStructure->data3d parametric mesh creation', async () => {
  let paramModelTypes = ['closet','column','door','floor','kitchen','polyfloor','railing','stairs','wall','window3d']
  paramModelTypes.forEach(async function(paramModelType){
    let minimalSceneStruc = { type: paramModelType }
    let result = await toData3d(minimalSceneStruc)
    expect(result).toHaveProperty('data3d.meshes')
    Object.keys(result.data3d.meshes).forEach(function(mk){
      expect(result).toHaveProperty('data3d.meshes.'+mk+'.positions')
      expect(result).toHaveProperty('data3d.meshes.'+mk+'.normals')

      expect(result.data3d.meshes[mk].positions).toBeInstanceOf(Float32Array)
      expect(result.data3d.meshes[mk].normals).toBeInstanceOf(Float32Array)

      expect(result).toSatisfy((result)=>( eval('result.data3d.meshes['+mk+'].positions').length>0 ))
      expect(result).toSatisfy((result)=>( eval('result.data3d.meshes['+mk+'].normals').length>0 ))

      expect(result).toSatisfy((result)=>( ! isNaN(result.data3d.meshes[mk].positions[0]) ))
      expect(result).toSatisfy((result)=>( ! isNaN(result.data3d.meshes[mk].normals[0]) ))

      // TODO add missing UVs in param model generators, then enable these tests
      /*
      expect(result).toHaveProperty('data3d.meshes.'+mk+'.uvs')
      expect(result.data3d.meshes[mk].uvs).toBeInstanceOf(Float32Array)
      expect(result).toSatisfy((result)=>( result.data3d.meshes[mk].uvs.length>0 ))
      expect(result).toSatisfy((result)=>( ! isNaN(result.data3d.meshes[mk].uvs[0]) ))
      */
    })
  })
})
