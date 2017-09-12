AFRAME.registerComponent('line-element', {
  schema: {
    l: {type: 'number', default: 1},
    h: {type: 'number', default: 1},
    w: {type: 'number', default: 1},
    color: {type: 'color', default: '#AAA'},
    type: {type: 'string', default: 'wall'}
  },
  init: function () {
    var data = this.data;
    var el = this.el;
    this.geometry = new THREE.BoxBufferGeometry(data.l, data.h, data.w);
    this.material = new THREE.MeshBasicMaterial({color: data.color});
    this.mesh = new THREE.Mesh(this.geometry, this.material);
    var direction = new THREE.Vector3(data.l / 2, 0, 0);
    this.mesh.position.add(direction); // add to position
    el.setObject3D('mesh', this.mesh);
  },
  /**
   * Update the mesh in response to property updates.
   */
  update: function (oldData) {
    var data = this.data;
    var el = this.el;
    // If `oldData` is empty, then this means we're in the initialization process.
    // No need to update.
    if (Object.keys(oldData).length === 0) { return; }
    // Geometry-related properties changed. Update the geometry.
    if (data.l !== oldData.l ||
      data.h !== oldData.h ||
      data.w !== oldData.w) {
      el.getObject3D('mesh').geometry = new THREE.BoxBufferGeometry(data.l, data.h, data.w);
    }
    // Material-related properties changed. Update the material.
    if (data.color !== oldData.color) {
      el.getObject3D('mesh').material.color = data.color;
    }
  }
});