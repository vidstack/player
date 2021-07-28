import { css } from 'lit';

export const scrimElementStyles = css`
  :host {
    display: block;
    contain: content;
    pointer-events: none;
  }

  :host([hidden]) {
    display: none;
  }

  #gradient {
    width: 100%;
    height: 258px;
    background: none;
    background-position: bottom;
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAECCAYAAAA/9r2TAAABKklEQVQ4T2XI50cFABiF8dvee++67b33uM17b1MkkSSSSBJJJIkkkkQSSSKJ9Efmeb8cr86HH88JBP4thkfEkiKOFPGkSCCNRE8SKZJJkUIaqZ40UqSTIoMUmaSR5ckmRQ4pckkjz5NPigJSFJKiiDSKPSWkKCVFGWmUeypIUUmKKlJUk0aNJ0iKWlLUkUa9p4EUjaRoIkUzabR4WknRRop20ujwdJKiixTdpOghjV5PHyn6STFAGoOeIVIMk2KEFKOkMeYZJ8UEKUKkMemZIsU0KWZIMUsac54wKSKkiJLGvGeBFIukWCLFMrkCq7AG67ABm7AF27ADu7AH+3AAh3AEx3ACp3AG53ABl3AF13ADt3AH9/AAj/AEz/ACr/AG7/ABn/AF3/ADv39LujSyJPVJ0QAAAABJRU5ErkJggg==');
  }

  :host([direction='down']) #gradient {
    transform: rotate(180deg);
  }
`;
