import { defineCustomElement } from 'maverick.js/element';

import { MediaAirPlayButtonElement } from '../../define/buttons/airplay-button-element';
import { MediaCaptionButtonElement } from '../../define/buttons/caption-button-element';
import { MediaFullscreenButtonElement } from '../../define/buttons/fullscreen-button-element';
import { MediaLiveButtonElement } from '../../define/buttons/live-button-element';
import { MediaMuteButtonElement } from '../../define/buttons/mute-button-element';
import { MediaPIPButtonElement } from '../../define/buttons/pip-button-element';
import { MediaPlayButtonElement } from '../../define/buttons/play-button-element';
import { MediaSeekButtonElement } from '../../define/buttons/seek-button-element';
import { MediaPlyrLayoutElement } from '../../define/layouts/plyr/plyr-layout-element';
import { MediaAudioRadioGroupElement } from '../../define/menus/audio-radio-group-element';
import { MediaCaptionsRadioGroupElement } from '../../define/menus/captions-radio-group-element';
import { MediaMenuButtonElement } from '../../define/menus/menu-button-element';
import { MediaMenuElement } from '../../define/menus/menu-element';
import { MediaMenuItemElement } from '../../define/menus/menu-item-element';
import { MediaMenuItemsElement } from '../../define/menus/menu-items-element';
import { MediaQualityRadioGroupElement } from '../../define/menus/quality-radio-group-element';
import { MediaSpeedRadioGroupElement } from '../../define/menus/speed-radio-group-element';
import { MediaPosterElement } from '../../define/poster-element';
import { MediaSliderPreviewElement } from '../../define/sliders/slider-preview-element';
import { MediaSliderThumbnailElement } from '../../define/sliders/slider-thumbnail-element';
import { MediaSliderValueElement } from '../../define/sliders/slider-value-element';
import { MediaTimeSliderElement } from '../../define/sliders/time-slider-element';
import { MediaVolumeSliderElement } from '../../define/sliders/volume-slider-element';
import { MediaThumbnailElement } from '../../define/thumbnail-element';
import { MediaTimeElement } from '../../define/time-element';

defineCustomElement(MediaPlyrLayoutElement);

// Poster
defineCustomElement(MediaPosterElement);

// Buttons
defineCustomElement(MediaPlayButtonElement);
defineCustomElement(MediaMuteButtonElement);
defineCustomElement(MediaCaptionButtonElement);
defineCustomElement(MediaPIPButtonElement);
defineCustomElement(MediaFullscreenButtonElement);
defineCustomElement(MediaSeekButtonElement);
defineCustomElement(MediaAirPlayButtonElement);
defineCustomElement(MediaLiveButtonElement);

// Sliders
defineCustomElement(MediaVolumeSliderElement);
defineCustomElement(MediaTimeSliderElement);
defineCustomElement(MediaSliderPreviewElement);
defineCustomElement(MediaSliderThumbnailElement);
defineCustomElement(MediaSliderValueElement);

// Menus
defineCustomElement(MediaMenuElement);
defineCustomElement(MediaMenuButtonElement);
defineCustomElement(MediaMenuItemsElement);
defineCustomElement(MediaMenuItemElement);
defineCustomElement(MediaAudioRadioGroupElement);
defineCustomElement(MediaCaptionsRadioGroupElement);
defineCustomElement(MediaSpeedRadioGroupElement);
defineCustomElement(MediaQualityRadioGroupElement);

// Display
defineCustomElement(MediaTimeElement);
defineCustomElement(MediaThumbnailElement);
