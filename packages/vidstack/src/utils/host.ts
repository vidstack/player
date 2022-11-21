import type { Observable } from 'maverick.js';
import type { ElementInstanceHost, MaverickElement } from 'maverick.js/element';

export function connectedHostElement(
  host: ElementInstanceHost,
): Observable<MaverickElement | null> {
  return () => (host.$connected ? host.el : null);
}
