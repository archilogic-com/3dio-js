import commonjs from 'rollup-plugin-commonjs';
import resolve from 'rollup-plugin-node-resolve'

export default {
  entry: 'src/base3d.js',
  indent: '\t',
  sourceMap: true,
  plugins: [ commonjs(), resolve() ],
  targets: [
    {
      format: 'umd',
      moduleName: 'Base3d',
      dest: 'build/base3d.js'
    }
  ]
}
