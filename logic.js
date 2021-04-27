const urlParams = new URLSearchParams(window.location.search);
let dir = urlParams.get("dir");
let query = urlParams.get("q");

var script = document.createElement('script');
script.contentType = "application/javascript;charset=utf-8"
script.onload = function () {
    document.body.innerHTML = `
        <div id="main">
        <form class="grey-box hstack" action="" method="GET" id="searchBar">
                <input name="q" type="search" id="searchBox" placeholder="Search...">
                <input type="submit" value="Search"> 
</form>
            <p>For previews to work, make sure you are logged in to OneDrive and have access to <a href="https://redhawks-my.sharepoint.com/:f:/r/personal/codykrad_seattleu_edu/Documents/Sound%20Effects%20Library%20MP3%20320kbps" target="_blank">this folder</a>.</p>
            <div id="results"></div>
        </div`;
if (dir != null) {
    showItemsFromDir(dir);
} else if (query != null) {

    document.getElementById("searchBox").value = query;
    search(query.replace(/[^\w ]/g,''));
}
};
script.src = "https://cdn.jsdelivr.net/gh/seattleviewniversity/seattleviewniversity.github.io@main/paths.js";
document.head.appendChild(script);


function resultHTML(pathList, searchResult) {
    tableHTML = searchResult ? "" : `<h2>All audio from folder "${dir}"</h2><hr>`
    pathList.forEach( function(path) {
        tableHTML += `
                <div>
                    <p>${paths[path]}</p>
                    <div class="hstack">
                        ${searchResult ? `<a href="?dir=${path.split('/').slice(0, -1).join('/')}"><button>More from folder</button></a>` : ''}
                        <div id="${path}">
                            <button onclick="addPlayer('${path}')">Preview</button>
                        </div>
                    </div>
                </div>
            <hr>`
    })

    return `
    <div class="grey-box">
            ${tableHTML}
    </div>`
}


const noResultHTML = "<div class='grey-box'><p>No results</p></div>";

function audioURL(path) {
    return `https://redhawks-my.sharepoint.com/personal/codykrad_seattleu_edu/Documents/Sound%20Effects%20Library%20MP3%20320kbps/${path}.mp3`
}

function pauseAll(except) {
    const elements = document.getElementsByClassName("rci");
    while(elements.length > 0){
        elements[0].parentNode.removeChild(elements[0]);
    }
    var sounds = document.getElementsByTagName('audio');
    for(i = 0; i < sounds.length; i++) {
        var audio = sounds[i];
        if (audio.parentElement.id != except) {
            audio.pause();
        }
    }
    document.getElementById(except).insertAdjacentHTML("afterend", `<p class="rci" style="margin:0;padding-top:0.5rem;padding-left:0.4rem">right-click the player to save the audio</p>`)
    
}

function addPlayer(path) {
    document.getElementById(path).innerHTML = `
    <audio autoplay onplay="pauseAll('${path}')" controls>
        <source src="${audioURL(path)}" type="audio/mpeg">
        Your browser does not support the audio element.
    </audio>
    `
}

function showItemsFromDir(dir) {
    var pathsToDisplay = []
    Object.keys(paths).forEach(function(path) {
        if (dir == path.split("/").slice(0, -1).join('/')) {
            pathsToDisplay.push(path)
        }
    })
    document.getElementById("results").innerHTML = resultHTML(pathsToDisplay, false);
}

function search(query) {
    if (query.length < 2) return;
    keywords = query.split(" ");
    var startMatches = new Set();         // starts with exact query
    var exactMatches = new Set();         // contains exact query
    var wordMatches = {};                 // count how many of keywords match words in desc
    var count = 0;
    for (desc in descs) {
        if (count > 400) {
            break;
        }
        if (desc.startsWith(query)) {
            Object.values(descs[desc]).forEach(function(path) {
                startMatches.add(path);
                count++;
            })
        } else if (desc.includes(query)) {
            Object.values(descs[desc]).forEach(function(path) {
                exactMatches.add(path);
                count++;
            })
        } else {
            var wordMatchCount = 0;
            keywords.forEach(function(keyword) {
                if (desc.includes(" " + keyword + " ") || desc.endsWith(" " + keyword) || desc.startsWith(keyword + " ")) {
                    wordMatchCount += 1;
                } else if (desc.includes(" " + keyword) || desc.startsWith(keyword)) {
                    wordMatchCount += 0.5;
                }

            });
            if (wordMatchCount > 0) {
                    Object.values(descs[desc]).forEach(function(path) {
                        if (wordMatches[path] !== undefined) {
                            wordMatches[path] = Math.max(wordMatches[path], wordMatchCount);
                        } else {
                            wordMatches[path] = wordMatchCount;
                        }
                    });
            }
        }

        
    }
    let minMatches = Math.floor(keywords.length / 2) + 1;
    var matches = Array.from(startMatches)
    exactMatches.forEach(function(path) {
        if (!matches.includes(path)) {
            matches.push(path);
        }
    })
    var pathData = [];
    for (var path in wordMatches) {
        const count = wordMatches[path];
        if (count >= minMatches) {
            pathData.push([path, count]);
        }
    }
    pathData.sort(function(a, b) {
        return b[1] - a[1];
    });
    pathData.forEach(function(pathInfo) {
        const path = pathInfo[0]
        if (!matches.includes(path)) {
            matches.push(path);
        }
    });
    
    document.getElementById("results").innerHTML = matches.length == 0 ? noResultHTML : resultHTML(matches, true); 
}
