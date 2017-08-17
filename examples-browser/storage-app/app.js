var el = document.getElementById('file-box')

io3d.utils.ui.fileDrop({
  elementId: 'file-drop-box',
  upload: true,
  dragOverCssClass: 'file-drop-box-dragover',
  onInput: function(keys){
    console.log(keys)
  }
})