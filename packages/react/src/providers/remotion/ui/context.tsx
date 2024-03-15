import * as React from 'react';

import {
  Internals,
  type CompositionManagerContext,
  type MediaVolumeContextValue,
  type SetMediaVolumeContextValue,
  type TimelineContextValue,
} from 'remotion';

import type { RemotionSrc } from '../types';

export const REMOTION_PROVIDER_ID = 'vds-remotion-provider';

export interface RemotionContextProviderProps {
  src: RemotionSrc;
  component: React.LazyExoticComponent<React.ComponentType<unknown>>;
  timeline: TimelineContextValue;
  mediaVolume: MediaVolumeContextValue;
  setMediaVolume: SetMediaVolumeContextValue;
  children: React.ReactNode;
  numberOfSharedAudioTags?: number;
}

export function RemotionContextProvider({
  src: {
    compositionWidth: width,
    compositionHeight: height,
    fps,
    durationInFrames,
    numberOfSharedAudioTags,
  },
  component,
  timeline,
  mediaVolume,
  setMediaVolume,
  children,
  numberOfSharedAudioTags: providedNumberOfAudioTags,
}: RemotionContextProviderProps) {
  const compositionManager = React.useMemo<CompositionManagerContext>(() => {
    return {
      compositions: [
        {
          id: REMOTION_PROVIDER_ID,
          component: component as React.LazyExoticComponent<React.ComponentType<unknown>>,
          durationInFrames,
          width,
          height,
          fps,
          nonce: 777,
          folderName: null,
          parentFolderName: null,
          schema: null,
          calculateMetadata: null,
        },
      ],
      folders: [],
      registerFolder: () => undefined,
      unregisterFolder: () => undefined,
      registerComposition: () => undefined,
      unregisterComposition: () => undefined,
      currentCompositionMetadata: null,
      setCurrentCompositionMetadata: () => undefined,
      canvasContent: { type: 'composition', compositionId: REMOTION_PROVIDER_ID },
      setCanvasContent: () => undefined,
    };
  }, [component, width, height, fps, durationInFrames]);

  const sequenceManager = React.useMemo(() => {
    let sequences: any[] = [];
    return {
      get sequences() {
        return sequences;
      },
      registerSequence(sequence) {
        sequences = [...sequences, sequence];
      },
      unregisterSequence(sequence) {
        sequences = sequences.filter((s) => s.id !== sequence);
      },
    };
  }, []);

  return (
    <Internals.IsPlayerContextProvider>
      <Internals.CanUseRemotionHooksProvider>
        <Internals.Timeline.TimelineContext.Provider value={timeline}>
          <Internals.CompositionManager.Provider value={compositionManager}>
            <Internals.SequenceManager.Provider value={sequenceManager}>
              <Internals.ResolveCompositionConfig>
                <Internals.PrefetchProvider>
                  <Internals.DurationsContextProvider>
                    <Internals.MediaVolumeContext.Provider value={mediaVolume}>
                      <Internals.NativeLayersProvider>
                        <Internals.SetMediaVolumeContext.Provider value={setMediaVolume}>
                          <Internals.SharedAudioContextProvider
                            numberOfAudioTags={
                              providedNumberOfAudioTags ?? numberOfSharedAudioTags!
                            }
                            component={component}
                          >
                            {children}
                          </Internals.SharedAudioContextProvider>
                        </Internals.SetMediaVolumeContext.Provider>
                      </Internals.NativeLayersProvider>
                    </Internals.MediaVolumeContext.Provider>
                  </Internals.DurationsContextProvider>
                </Internals.PrefetchProvider>
              </Internals.ResolveCompositionConfig>
            </Internals.SequenceManager.Provider>
          </Internals.CompositionManager.Provider>
        </Internals.Timeline.TimelineContext.Provider>
      </Internals.CanUseRemotionHooksProvider>
    </Internals.IsPlayerContextProvider>
  );
}

RemotionContextProvider.displayName = 'RemotionContextProvider';
