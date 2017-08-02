import normalizeSession from './common/normalize-session.js'
import Rx from 'rxjs/BehaviorSubject.js'

/**
 * Creates a session stream
 * @function IO3D.auth.session$
 */

var session$ = new Rx.BehaviorSubject(normalizeSession({}))

export default session$