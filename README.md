<p align="center"><a href="https://3d.io" target="_blank"><img width="400" alt="toolkit for interior apps" src="3dio-logo.png"></a></p>

<div align="center">
  <a href="https://3d.io">Site</a>&mdash;<a href="https://3d.io/docs/1/">Docs</a>&mdash;<a href="https://3d.io/releases/">Releases</a>&mdash;<a href="https://3d.io/#features">Features</a>
</div>


## Basic Examples 

[Open Demo](https://3dio-aframe.glitch.me)
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://3d.io/releases/3dio-js/1.x.x-beta/3dio.min.js"></script>
</head>
<body>
<a-scene>
  <!-- A-Frame Components Loading Content from 3d.io -->
  <a-entity io3d-data3d="key:/fd72bf39-9d3a-471f-a4ff-ecaa3f5ff30b/bake/2017-04-15_22-45-14_XsiltX/regular/lighting.gz.data3d.buffer" position="0 -5 -6"></a-entity>
  <a-entity io3d-furniture="id:10a54bcf-3b9c-4518-b7ea-81c4251cf5a4" position="-0.85 -5 -5.4"></a-entity>
</a-scene>
</body>
</html>
```

## Documentation

https://3d.io/docs/1/

## Distribution

### Browser
* Latest minor version: https://3d.io/releases/3dio-js/1.x.x-beta/3dio.min.js
* Latest patch version: https://3d.io/releases/3dio-js/1.0.x-beta/3dio.min.js
* Latest version, check out: https://3d.io/releases/

### Node
* node: `npm install 3dio --save`

## Features

https://3d.io/#products

## Use Cases

https://3d.io/#use-cases
