import { hasTriggerEvent, walkTriggerEventChain } from 'vidstack';

const provider = document.querySelector('vds-video')!;

provider.addEventListener('play', (event) => {
  // was this triggered by an actual person?
  const userPlayed = event.isOriginTrusted;
  // equivalent to above
  const isTrusted = event.originEvent.isTrusted;
});

provider.addEventListener('playing', (event) => {
  // walk through each trigger event in the chain.
  walkTriggerEventChain(event, (trigger) => {
    console.log(trigger);
  });

  // is this resuming from buffering?
  if (hasTriggerEvent(event, 'waiting')) {
    // ...
  }
});
