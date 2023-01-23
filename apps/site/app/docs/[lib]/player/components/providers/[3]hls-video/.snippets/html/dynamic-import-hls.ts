const provider = document.querySelector('vds-hls-video');
provider.library = () => import('hls.js');
