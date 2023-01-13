const provider = document.querySelector('vds-hls-video');
provider.hlsLibrary = () => import('hls.js');
