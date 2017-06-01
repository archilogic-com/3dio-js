// pushing data to the renderer

//  // hierarchy
//  bq.on('**/*:add', function(uuid, entity){
//    console.log('Added entity to scene. uuid:'+entity)
//  })
//  // geometry
//  bq.on('**/*:data:geometry', function(uuid, entity, geometry){
//    console.log('Entity geometry data updated (loaded or updated by param change). uuid:'+geometry)
//  })
//  // material
//  bq.on('**/*:data:material', function(uuid, entity, material){
//    console.log('Entity material data updated (loaded or updated by param change). uuid:'+geometry)
//  })

// create scene
var scene = new bq.Entity()
//console.log('Created scene (root level entity) with uuid:' + scene.uuid)
// initiate loading

bq.add('../assets/cubes.base.json')

// TODO: renderer: catch error case of unknown uuid (exception: add)
// TODO: bq: detect invalid hierarchies (ie. cycles) in file reference and dynamic scene handling
