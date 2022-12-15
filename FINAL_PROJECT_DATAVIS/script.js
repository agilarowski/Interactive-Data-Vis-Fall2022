// Loading all scripts 

function loadScript(src){
    const script = document.createElement('script');
    script.src = src;
    document.head.prepend(script);
}

loadScript('map.js');
loadScript('dvj-all.js');
loadScript('heatmap.js');