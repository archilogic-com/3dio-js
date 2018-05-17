'use strict';
/*
for file in $(ls ./src/scene/structure/parametric-objects/ | grep -v common | perl -pe 's/\.js//g'); do
echo "import $file from '../$file'"
done
*/
import closet from '../closet'
import column from '../column'
import door from '../door'
import floor from '../floor'
import kitchen from '../kitchen'
import polyfloor from '../polyfloor'
import railing from '../railing'
import stairs from '../stairs'
import wall from '../wall'
import window3d from '../window3d'

export default {
  closet: closet,
  column: column,
  door: door,
  floor: floor,
  kitchen: kitchen,
  polyfloor: polyfloor,
  stairs: stairs,
  railing: railing,
  wall: wall,
  window3d: window3d,
}
