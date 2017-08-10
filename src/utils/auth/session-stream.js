import normalizeSession from './common/normalize-session.js'
import Rx from 'rxjs/BehaviorSubject.js'

/**
 * Creates a session stream
 * @function io3d.auth.session$
 */

var session$ = new Rx.BehaviorSubject(normalizeSession({}))

export default session$