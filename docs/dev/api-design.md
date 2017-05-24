# API Design

## Configs
WIP

## Scene Parsing
* ms.scene.find
* ms.scene.findFirst
* ms.scene.getChildren
* ms.scene.getParent

## Scene Editing
* ms.scene.add
* ms.scene.remove

## Storage
* ms.storage.load
* ms.storage.save
* ms.storage.setAutoSave

## Import
* ms.import.ms1
* ms.import.ifc

## Export
* ms.export.ms1
* ms.export.ifc

## Real-time Collaboration
* ms.channel.open
* ms.channel.close
* ms.channel.join
* ms.channel.leave

## Events
### Listeners
simple event listener:
```javascript
entity.on('add', callback)
```
one time listener:
```javascript
entity.once('add', callback)
```
returns a promise when no callback function is provided:
```javascript
entity.once('add').then( callback)
```
catch all events of a specific entity:
```javascript
entity.on('*', callback)
```
multiple events in one handler:
```javascript
entity.on(['add','remove'], callback)
```

### Hierarchy
include children:
```javascript
entity.on('*/add', callback)
```
include children recursively:
```javascript
entity.on('**/add', callback)
```
include parent:
```javascript
entity.on('../add', callback)
```
include parents recursively:
```javascript
entity.on('.../add', callback)
```

### Selectors
by id:
```javascript
scene.on('**/#myEntityId:update', callback)
```
by class
```javascript
scene.on('**/.window:update', callback)
```

### Property Updates
geometries
```javascript
entity.on('update.geometries', callback)
```
geometries and materials
```javascript
entity.on(['update.geometries','update.materials'], callback)
```
