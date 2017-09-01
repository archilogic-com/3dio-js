// TODO: increase performance
// TODO: decouple from THREEjs
// TODO: make use of edge case threshold=0 (no need to compare face normals)

export default function generateWireframeBuffer( positions, thresholdAngle ) {
	
//    console.time('calc')

	// internals
	var thresholdDot = Math.cos( thresholdAngle * Math.PI / 180 )
	var edge = [ 0, 0 ]
	var hash = {}
	var keys = [ 'a', 'b', 'c' ]

	var tempGeometry = new THREE.Geometry()
	for (var i = 0, j = 0; i < positions.length / 3; i += 3, j += 9) {
		tempGeometry.vertices[ tempGeometry.vertices.length ] = new THREE.Vector3( positions[ j ], positions[ j + 1 ], positions[ j + 2 ] )
		tempGeometry.vertices[ tempGeometry.vertices.length ] = new THREE.Vector3( positions[ j + 3 ], positions[ j + 4 ], positions[ j + 5 ] )
		tempGeometry.vertices[ tempGeometry.vertices.length ] = new THREE.Vector3( positions[ j + 6 ], positions[ j + 7 ], positions[ j + 8 ] )
		tempGeometry.faces[ tempGeometry.faces.length ] = new THREE.Face3( i, i + 1, i + 2, [], [] )
	}
	tempGeometry.mergeVertices()
	tempGeometry.computeFaceNormals()

	var vertices = tempGeometry.vertices
	var faces = tempGeometry.faces
	var numEdges = 0

	for ( var i = 0, l = faces.length; i < l; i ++ ) {
		var face = faces[ i ];
		for ( var j = 0; j < 3; j ++ ) {

			edge[ 0 ] = face[ keys[ j ] ];
			edge[ 1 ] = face[ keys[ ( j + 1 ) % 3 ] ];
			edge.sort( sortFunction );

			var key = edge.toString();

			if ( hash[ key ] === undefined ) {
				hash[ key ] = { vert1: edge[ 0 ], vert2: edge[ 1 ], face1: i, face2: undefined };
				numEdges ++;
			} else {
				hash[ key ].face2 = i;
			}
		}
	}

	var coords = new Float32Array( numEdges * 2 * 3 )
	var index = 0

	for ( var key in hash ) {
		var h = hash[ key ];
		if ( h.face2 === undefined || faces[ h.face1 ].normal.dot( faces[ h.face2 ].normal ) <= thresholdDot ) {

			var vertex = vertices[ h.vert1 ];
			coords[ index ++ ] = vertex.x;
			coords[ index ++ ] = vertex.y;
			coords[ index ++ ] = vertex.z;

			vertex = vertices[ h.vert2 ];
			coords[ index ++ ] = vertex.x;
			coords[ index ++ ] = vertex.y;
			coords[ index ++ ] = vertex.z;

		}
	}

//    console.timeEnd('calc')

	return coords

}

// helpers

function sortFunction ( a, b ) { return a - b }