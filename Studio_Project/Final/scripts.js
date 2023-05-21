function loadScript(src){
    const script = document.createElement('script');
    script.src = src;
    document.head.prepend(script);
}

loadScript('main.js');
loadScript('dvj-all.js');
loadScript('heatmap.js');
loadScript('migration.js');