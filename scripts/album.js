// Example Data (in place of database)
var albumPicasso = {
     title: 'The Colors',
     artist: 'Pablo Picasso',
     label: 'Cubism',
     year: '1881',
     albumArtUrl: 'assets/images/album_covers/01.png',
     songs: [
         { title: 'Blue', duration: '4:26' },
         { title: 'Green', duration: '3:14' },
         { title: 'Red', duration: '5:01' },
         { title: 'Pink', duration: '3:21'},
         { title: 'Magenta', duration: '2:15'}
     ]
};
var albumMarconi = {
     title: 'The Telephone',
     artist: 'Guglielmo Marconi',
     label: 'EM',
     year: '1909',
     albumArtUrl: 'assets/images/album_covers/20.png',
     songs: [
         { title: 'Hello, Operator?', duration: '1:01' },
         { title: 'Ring, ring, ring', duration: '5:01' },
         { title: 'Fits in your pocket', duration: '3:21'},
         { title: 'Can you hear me now?', duration: '3:14' },
         { title: 'Wrong phone number', duration: '2:15'}
     ]
 };
var albumATE = {
    title: 'Songs of God and Whiskey',
    artist: 'The Airborne Toxic Event',
    label: 'Epic',
    year: '2015',
    albumArtUrl: 'assets/images/album_covers/01.png',
    songs: [
        { title: 'Song 1', duration: '4:26' },
        { title: 'Song 2', duration: '3:14' },
        { title: 'Song 3', duration: '5:01' },
        { title: 'Song 4', duration: '3:21'}
     ]
};

var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
 
     return template;
 };

 var setCurrentAlbum = function(album) {
     var albumTitle = document.getElementsByClassName('album-view-title')[0];
     var albumArtist = document.getElementsByClassName('album-view-artist')[0];
     var albumReleaseInfo = document.getElementsByClassName('album-view-release-info')[0];
     var albumImage = document.getElementsByClassName('album-cover-art')[0];
     var albumSongList = document.getElementsByClassName('album-view-song-list')[0];
 
     albumTitle.firstChild.nodeValue = album.title;
     albumArtist.firstChild.nodeValue = album.artist;
     albumReleaseInfo.firstChild.nodeValue = album.year + ' ' + album.label;
     albumImage.setAttribute('src', album.albumArtUrl);
 
     albumSongList.innerHTML = '';
     for (var i = 0; i < album.songs.length; i++) {
         albumSongList.innerHTML += createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
     }
};

var findParentByClassName = function(current, name) {
    var found = false;
    if (current.parentElement === null) {
        alert("No parent found.");
        return null;
    } else {
        while (!found) {
            if (current.parentElement == null) {
                alert("No parent found with that class name.");
                return null;
            }
            else if (current.parentElement.classList.contains(name)) {
                found = current.parentElement;
                return found;
            }
            else {
                current = current.parentElement;
            }
        };
    }
};

var getSongItem = function(element) {
    var songItemNumber;
    switch (element.className) {
        case "album-song-button":
        case "ion-play":
        case "ion-pause":
            songItemNumber = findParentByClassName(element, 'song-item-number');
            break;
        case "song-item-number":
            songItemNumber = element;
            break;
        case "album-view-song-item":
            songItemNumber = element.querySelector('.song-item-number');
            break;
        case "song-item-title":
        case "song-item-duration":
            songItemNumber = findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
    }
    return songItemNumber;
};

var clickHandler = function(targetElement) {
    var songItem = getSongItem(targetElement);
    if (currentlyPlayingSong === null) {
        songItem.innerHTML = pauseButtonTemplate;
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
        songItem.innerHTML = playButtonTemplate;
        currentlyPlayingSong = null;
    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
        var currentlyPlayingSongElement = document.querySelector('[data-song-number="'+currentlyPlayingSong+'"]');
        // change currently playing song from pause button to song number
        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
        // change new song to pause button
        songItem.innerHTML = pauseButtonTemplate;
        // save currently playing song number
        currentlyPlayingSong = songItem.getAttribute('data-song-number');
    }
};

var albumDatabase = [albumPicasso, albumMarconi, albumATE],
cover = document.getElementsByClassName('album-cover-art')[0];
function rotateAlbum(event) {
    var currentTitle = document.getElementsByClassName('album-view-title')[0].textContent;
    for (var i=0; i<albumDatabase.length; i++) {
        if (albumDatabase[i].title == currentTitle) {
            var newIndex = i + 1;
            if (i == albumDatabase.length-1) {
                newIndex = 0;
            }
            setCurrentAlbum(albumDatabase[newIndex]);
        }
    };
};

var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

window.onload = function() {
    setCurrentAlbum(albumPicasso);
    cover.addEventListener('click', rotateAlbum);
    songListContainer.addEventListener('mouseover', function(event) {
        var songItem = getSongItem(event.target);
        var songItemNumber = songItem.getAttribute('data-song-number');
        if (event.target.parentElement.className === 'album-view-song-item' 
            && songItemNumber !== currentlyPlayingSong) {
            songItem.innerHTML = playButtonTemplate;
        }
    });
    for (var i=0; i<songRows.length; i++) {
        songRows[i].addEventListener('mouseleave', function(event) {
            var songItem = getSongItem(event.target);
            var songItemNumber = songItem.getAttribute('data-song-number');
            if (songItemNumber !== currentlyPlayingSong) {
                songItem.innerHTML = songItemNumber;
            }
        });
        songRows[i].addEventListener('click', function(event) {
            clickHandler(event.target);
        })
    };
    
    // testing of new features
//    console.log(findParentByClassName(songRows[0],'album-view').className)
//    songListContainer.addEventListener('click', function(event) {
//        console.log(event.target.className);
//        console.log(getSongItem(event.target));
//    })
//    console.log(findParentByClassName(songRows[0], 'test'));
// console.log(findParentByClassName(document.documentElement, 'test'));
    
};


