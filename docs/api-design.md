# ms.js API

WORK IN PROGRESS

_Note: Documentation and reference will reside in code. This is a place for openly formulated design iterations preceding implementation._

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
```
entity.on(‘add’, …)
```
one time listener:
```
entity.once(‘add’, …)
```
returns a promise when no callback function is provided:
```
entity.once(‘add’).then( …)
```
catch all events of a specific entity:
```
entity.on(‘*’, …)
```
multiple events in one handler:
```
entity.on([‘**/add’, ‘**/remove’], …)
```

### Hierarchy
catch all events of a specific property:
```
entity.on(‘add’, …)
```
include all children (recursive):
```
entity.on(‘**/add’, …)
```
include direct children only (non-recursive):
```
entity.on(‘*/add’, …)
```
include all parent (recursive):
```
entity.on(‘.../add’, …)
```
include direct parent only (non-recursive):
```
entity.on(‘../add’, …)
```

### Selectors
by id:
```
scene.on(‘**/#myEntityId:update’, …)
```
by class
```
scene.on(‘**/.window:update’, …)
```

### Property Updates
geometries
```
entity.on(‘update.geometries’, …)
```
geometries and materials
```
entity.on([‘update’.geometries’, ‘update.materials’], …)
```