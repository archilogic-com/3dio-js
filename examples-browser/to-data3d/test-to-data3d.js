
(async function(){
var sceneStructure=await io3d.scene.getStructure('7d7c6479-2f60-4685-ae82-4d64fe507c0c')
console.log(sceneStructure)
var data3d = await io3d.scene.toData3d(sceneStructure)
console.log(data3d)
})()
