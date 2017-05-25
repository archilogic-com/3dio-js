// pushing data to the renderer

//  // hierarchy
//  base3d.on('**/*:add', function(uuid, entity){
//    console.log('Added entity to scene. uuid:'+entity)
//  })
//  // geometry
//  base3d.on('**/*:data:geometry', function(uuid, entity, geometry){
//    console.log('Entity geometry data updated (loaded or updated by param change). uuid:'+geometry)
//  })
//  // material
//  base3d.on('**/*:data:material', function(uuid, entity, material){
//    console.log('Entity material data updated (loaded or updated by param change). uuid:'+geometry)
//  })

// create scene
var scene = new base3d.Entity()
//console.log('Created scene (root level entity) with uuid:' + scene.uuid)
// initiate loading
scene.add('../assets/cubes.base3d.json')

// TODO: renderer: catch error case of unknown uuid (exception: add)
// TODO: base3d.js: detect invalid hierarchies (ie. cycles) in file reference and dynamic scene handling
