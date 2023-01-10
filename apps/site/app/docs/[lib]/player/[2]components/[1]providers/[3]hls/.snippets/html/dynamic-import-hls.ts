const provider = document.querySelector('vds-hls');
provider.hlsLibrary = () => import('hls.js');
