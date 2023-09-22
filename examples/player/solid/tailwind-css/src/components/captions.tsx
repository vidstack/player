import styles from './captions.module.css';

export function Captions() {
  return (
    <media-captions
      class={`${styles.captions} media-preview:opacity-0 media-controls:bottom-[85px] media-captions:opacity-100 absolute inset-0 bottom-2 z-10 select-none break-words opacity-0 transition-[opacity,bottom] duration-300`}
    />
  );
}
