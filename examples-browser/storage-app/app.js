var el = document.getElementById('file-box')

io3d.utils.ui.fileDrop({
  elementId: 'file-drop-box',
  upload: false,
  dragOverCssClass: 'file-drop-box-dragover',
  onDrop: function(keys){
    console.log(keys)
  },
  onProgress: function(prog, tot){
    console.log(prog/tot)
  }
})