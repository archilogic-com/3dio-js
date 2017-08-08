var el = document.getElementById('file-box')

io3d.ui.createFileDrop({
  elementId: 'file-box',
  //upload: true,
  onDrop: function(keys){
    console.log(keys)
  },
  onProgress: function(prog, tot){
    console.log(prog/tot)
  }
})