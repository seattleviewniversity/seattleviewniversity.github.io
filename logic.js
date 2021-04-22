var script = document.createElement('script');
script.contentType = "application/javascript;charset=utf-8"
script.onload = function () {
    document.body.innerHTML = `
        <div id="main">
            <div class="grey-box">
                <input type="text" id="searchBox" onkeyup="search()" placeholder="Search...">
            </div>
            <p>For previews to work, make sure you are logged in to OneDrive and have access to <a href="https://redhawks-my.sharepoint.com/:f:/r/personal/codykrad_seattleu_edu/Documents/Sound%20Effects%20Library%20MP3%20320kbps" target="_blank">this folder</a>.</p>
            <div id="results"></div>
        </div`;
let keys = Object.keys(paths);
var descArr = Object.keys(descs)
};
script.src = "https://cdn.jsdelivr.net/gh/seattleviewniversity/seattleviewniversity.github.io@main/paths.js";

document.head.appendChild(script); //or something of the likes


function resultHTML(pathList) {
    tableHTML = ""
    pathList.forEach( function(path) {
        tableHTML += `
                <div>
                    <p>${paths[path]}</p>
                    <div id="${path}">
                        <button onclick="addPlayer('${path}')">Preview</button>
                        </div>
                </div>
            <hr>`
    })

    return `
    <div class="grey-box">
            ${tableHTML}
    </div>`
}

function noResultHTML() {
    return "<div class='grey-box'><p>No results</p></div>"
}

function audioURL(path) {
    return `https://redhawks-my.sharepoint.com/personal/codykrad_seattleu_edu/Documents/Sound%20Effects%20Library%20MP3%20320kbps/${path}.mp3`
}

function addPlayer(path) {
    document.getElementById(path).innerHTML = `
    <audio controls>
        <source src="${audioURL(path)}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    <br>
    <a href="${audioURL(path)}" download="test.mp3" target="_blank">Direct link</a>`
    
}

function search() {
    const keyword = document.getElementById("searchBox").value.toLowerCase();
    if (keyword.length < 2) return;
    var pathsToDisplay = new Set();
    for (desc in descs) {
        if (desc.includes(keyword)) {
            const resultPaths = descs[desc];
            for (path in descs[desc]) {
                pathsToDisplay.add(resultPaths[path]);
            }
        }
    }
    console.log(pathsToDisplay)
    document.getElementById("results").innerHTML = pathsToDisplay.size == 0 ? noResultHTML() : resultHTML(pathsToDisplay);

}
