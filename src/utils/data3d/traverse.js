export default function traverseData3d(data3d, callback) {

  callback(data3d)

  if (data3d.children) for (var i=0, l=data3d.children.length; i<l; i++) traverseData3d(data3d.children[i], callback)

}