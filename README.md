# 3dio.js BETA
javaScript toolkit for interior apps

https://3d.io

## Examples

### A-Frame Components Loading Content from 3d.io

[Open in jsFiddle](https://jsfiddle.net/3dio/5wgoq2u7/embedded/result,html/dark/)
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="https://3d.io/releases/3dio-js/1.x.x-beta/3dio.min.js"></script>
</head>
<body>
<a-scene>
  <a-entity 3dio-data3d="key:/fd72bf39-9d3a-471f-a4ff-ecaa3f5ff30b/bake/2017-04-15_22-45-14_XsiltX/regular/lighting.gz.data3d.buffer" position="0 -5 -6"></a-entity>
  <a-entity 3dio-furniture="id:10a54bcf-3b9c-4518-b7ea-81c4251cf5a4" position="-0.85 -5 -5.4"></a-entity>
</a-scene>
</body>
</html>
```

## Use Cases

https://3d.io/#use-cases

## Features

https://3d.io/#products

## Documentation

https://3d.io/docs/1/index.html

## Distribution

* browser: `<script src="https://3d.io/releases/3dio-js/1.x.x-beta/3dio.min.js"></script>`
* node: `npm install 3dio --save`
