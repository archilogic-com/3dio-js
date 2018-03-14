<p align="center"><a href="https://app.3d.io/oFXeKW" target="_blank"><img width="280" alt="toolkit for interior apps" src="img/title-pic.gif"></a></p>

<div align="center">
  <a href="https://3d.io">Website</a>
  &mdash;
  <a href="https://3d.io/docs/api/1/">Docs</a>
  &mdash;
  <a href="#install">Install</a>
  &mdash;
  <a href="https://dist.3d.io/">Releases</a>
  &mdash;
  <a href="#contribute">Contribute</a>
</div>


## Basic Example

[Run Demo](https://3dio-aframe.glitch.me)
```html
<!DOCTYPE html>
<html>
<head>
  <script src="https://aframe.io/releases/0.7.1/aframe.min.js"></script>
  <script src="https://dist.3d.io/3dio-js/1.1.x/3dio.min.js"></script>
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

Learn more about using 3d.io data at https://furniture.3d.io

## Documentation

https://3d.io/docs/api/1/

## Install

### Browser

```html
<head>
  <!-- latest minor version -->
  <script src="https://dist.3d.io/3dio-js/1.x.x/3dio.min.js"></script>
</head>
```

### Server

`npm install 3dio --save`

Installation tutorial for beginners: https://www.npmjs.com/package/3dio/tutorial

## Features

https://3d.io/#products

## Use Cases

https://3d.io/#use-cases

## Contribute

Install local dev environment:

1. Clone repository: 

    `git clone https://github.com/archilogic-com/3dio-js.git ; cd ./3dio-js`
2. Install global packages: 

    `npm install rollup -g ; npm install lite-server -g`
3. Install local packages: 

    `npm install`
4. Run local dev server: 

    `npm start`
5. Run tests (jest)

    `npm test`

Please follow our [Contribution guidelines](.github/CONTRIBUTING.md)
