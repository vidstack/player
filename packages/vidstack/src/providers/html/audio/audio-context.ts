let audioContext: AudioContext | null = null,
  gainNodes: GainNode[] = [],
  elAudioSources: MediaElementAudioSourceNode[] = [];

export function getOrCreateAudioCtx(): AudioContext {
  return (audioContext ??= new AudioContext());
}

export function createGainNode() {
  const audioCtx = getOrCreateAudioCtx(),
    gainNode = audioCtx.createGain();

  gainNode.connect(audioCtx.destination);
  gainNodes.push(gainNode);

  return gainNode;
}

export function createElementSource(el: HTMLMediaElement, gainNode?: GainNode) {
  const audioCtx = getOrCreateAudioCtx(),
    src = audioCtx.createMediaElementSource(el);

  if (gainNode) {
    src.connect(gainNode);
  }

  elAudioSources.push(src);

  return src;
}

export function destroyGainNode(node: GainNode) {
  const idx = gainNodes.indexOf(node);

  if (idx !== -1) {
    gainNodes.splice(idx, 1);
    node.disconnect();

    freeAudioCtxWhenAllResourcesFreed();
  }
}

export function destroyElementSource(src: MediaElementAudioSourceNode) {
  const idx = elAudioSources.indexOf(src);

  if (idx !== -1) {
    elAudioSources.splice(idx, 1);
    src.disconnect();

    freeAudioCtxWhenAllResourcesFreed();
  }
}

export function freeAudioCtxWhenAllResourcesFreed() {
  if (audioContext && gainNodes.length === 0 && elAudioSources.length === 0) {
    audioContext.close().then(() => {
      audioContext = null;
    });
  }
}
