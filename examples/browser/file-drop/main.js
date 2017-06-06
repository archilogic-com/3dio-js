var el = document.getElementById('file-box')

BASE.ui.createFileDrop({
  elementId: 'file-box',
  //upload: true,
  onDrop: function(keys){
    console.log(keys)
  },
  onProgress: function(prog, tot){
    console.log(prog/tot)
  }
})