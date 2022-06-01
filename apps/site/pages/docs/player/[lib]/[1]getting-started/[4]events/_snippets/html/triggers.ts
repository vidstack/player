import { hasTriggerEvent, walkTriggerEventChain } from '@vidstack/player';

const provider = document.querySelector('vds-video');

provider.addEventListener('vds-play', (event) => {
  // was this triggered by an actual person?
  const userPlayed = event.isOriginTrusted;

  // equivalent
  const isTrusted = userPlayed.originEvent.isTrusted;
});

provider.addEventListener('vds-playing', (event) => {
  // walk through each trigger event in the chain.
  walkTriggerEventChain(event, (trigger) => {
    console.log(trigger);
  });

  // is this resuming from buffering?
  if (hasTriggerEvent(event, 'vds-waiting')) {
    // ...
  }
});
