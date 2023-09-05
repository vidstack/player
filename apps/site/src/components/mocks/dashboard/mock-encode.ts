import { writable } from 'svelte/store';

export interface MockEncodeProgress {
  upload: number;
  encode: number;
}

export const mockEncodeProgress = writable<MockEncodeProgress[]>([]);

export const mockVideoTitles = [
  'Installation',
  'Thinking in React',
  'Your First Component',
  'Responding to Events',
  'Render and Commit',
  'State as a Snapshot',
];

export const mockVideos = [
  {
    title: mockVideoTitles[0],
    duration: '1:05',
    tags: ['Describing UI', 'Beginner', 'Part One', '1080p', 'MP4'],
  },
  {
    title: mockVideoTitles[1],
    duration: '5:30',
    tags: ['Describing UI', 'Beginner', 'Part One', 'HLS'],
  },
  {
    title: mockVideoTitles[2],
    duration: '7:30',
    tags: ['Describing UI', 'Beginner', 'Part One', 'HLS'],
  },
  {
    title: mockVideoTitles[3],
    duration: '10:05',
    tags: ['Adding Interactivity', 'Intermediate', 'Part Two', 'HLS'],
  },
  {
    title: mockVideoTitles[4],
    duration: '12:30',
    tags: ['Adding Interactivity', 'Intermediate', 'Part Two', 'HLS'],
  },
  {
    title: mockVideoTitles[5],
    duration: '12:40',
    tags: ['Adding Interactivity', 'Intermediate', 'Part Two', 'HLS'],
  },
];
