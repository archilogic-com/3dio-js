# 3d.io - toolkit for interior apps

## Example: A-Frame app with content from 3d.io

```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/0.6.0/aframe.min.js"></script>
  <script src="http://3d.io/releases/1.0.0-beta.2/3dio.min.js"></script>
</head>
<body>
<a-scene>
  <a-entity 3dio-data3d="key:/fd72bf39-9d3a-471f-a4ff-ecaa3f5ff30b/bake/2017-04-15_22-45-14_XsiltX/regular/lighting.gz.data3d.buffer" position="0 -5 -6"></a-entity>
  <a-entity 3dio-furniture="id:10a54bcf-3b9c-4518-b7ea-81c4251cf5a4" position="-0.85 -5 -5.4"></a-entity>
</a-scene>
</body>
</html>
```

## Distribution

* browser: `<script src="http://3d.io/js/dist/1.0.0-beta.2/3dio.min.js"></script>`
* node: `npm install 3dio --save`

## Contribute

&#9758; [Development page](docs/development.md)
