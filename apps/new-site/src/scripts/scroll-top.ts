import { scrollTop } from '../stores/scroll';
import { IS_BROWSER } from '../utils/env';

if (IS_BROWSER) {
  scrollTop.subscribe((top) => {
    if (top > 0) {
      document.body.setAttribute('data-scrolled', '');
    } else {
      document.body.removeAttribute('data-scrolled');
    }
  });
}
