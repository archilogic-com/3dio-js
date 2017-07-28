var el = document.getElementById('file-box')

IO3D.ui.createFileDrop({
  elementId: 'file-box',
  //upload: true,
  onDrop: function(keys){
    console.log(keys)
  },
  onProgress: function(prog, tot){
    console.log(prog/tot)
  }
})