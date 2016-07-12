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
     var onHover = function() {
        // 'this' = a row
        var $songItem = $(this).find('.song-item-number');
        var $songItemNumber = $songItem.attr('data-song-number');
        if ($songItemNumber !== currentlyPlayingSong) {
            $songItem.html(playButtonTemplate);
        }
     };
     var offHover = function() {
        // 'this' = a row
        var $songItem = $(this).find('.song-item-number');
        var $songItemNumber = $songItem.attr('data-song-number');
        if ($songItemNumber !== currentlyPlayingSong) {
            $songItem.html($songItemNumber);
        }
     };
     var clickHandler = function() {
        // 'this' = song-item-number element within a row
        var $songItem = $(this);
        //console.log($songItem['context'].className);
        if (currentlyPlayingSong === null) {
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = $songItem.attr('data-song-number');
        } else if (currentlyPlayingSong === $songItem.attr('data-song-number')) {
            $songItem.html(playButtonTemplate);
            currentlyPlayingSong = null;
        } else if (currentlyPlayingSong !== $songItem.attr('data-song-number')) {
            var $currentlyPlayingSongElement = $(document).find('[data-song-number="'+currentlyPlayingSong+'"]');
            $currentlyPlayingSongElement.html($currentlyPlayingSongElement.attr('data-song-number'));
            $songItem.html(pauseButtonTemplate);
            currentlyPlayingSong = $songItem.attr('data-song-number');
        }
     };
 
     var $row = $(template);
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
     
 };

 var setCurrentAlbum = function(album) {
     var $albumTitle = $('.album-view-title');
     var $albumArtist = $('.album-view-artist');
     var $albumReleaseInfo = $('.album-view-release-info');
     var $albumImage = $('.album-cover-art');
     var $albumSongList = $('.album-view-song-list');
 
     $albumTitle.text(album.title);
     $albumArtist.text(album.artist);
     $albumReleaseInfo.text(album.year + ' ' + album.label);
     $albumImage.attr('src', album.albumArtUrl);
 
     $albumSongList.empty();
     for (var i = 0; i < album.songs.length; i++) {
         var $newRow = createSongRow(i + 1, album.songs[i].title, album.songs[i].duration);
         $albumSongList.append($newRow);
     }
};

//var findParentByClassName = function(current, name) {
//    var found = false;
//    if (current.parentElement === null) {
//        alert("No parent found.");
//        return null;
//    } else {
//        while (!found) {
//            if (current.parentElement == null) {
//                alert("No parent found with that class name.");
//                return null;
//            }
//            else if (current.parentElement.classList.contains(name)) {
//                found = current.parentElement;
//                return found;
//            }
//            else {
//                current = current.parentElement;
//            }
//        };
//    }
//};
//
//var getSongItem = function(element) {
//    var songItemNumber;
//    switch (element.className) {
//        case "album-song-button":
//        case "ion-play":
//        case "ion-pause":
//            songItemNumber = findParentByClassName(element, 'song-item-number');
//            break;
//        case "song-item-number":
//            songItemNumber = element;
//            break;
//        case "album-view-song-item":
//            songItemNumber = element.querySelector('.song-item-number');
//            break;
//        case "song-item-title":
//        case "song-item-duration":
//            songItemNumber = findParentByClassName(element, 'album-view-song-item').querySelector('.song-item-number');
//    }
//    return songItemNumber;
//};
//
//var clickHandler = function(targetElement) {
//    var songItem = getSongItem(targetElement);
//    if (currentlyPlayingSong === null) {
//        songItem.innerHTML = pauseButtonTemplate;
//        currentlyPlayingSong = songItem.getAttribute('data-song-number');
//    } else if (currentlyPlayingSong === songItem.getAttribute('data-song-number')) {
//        songItem.innerHTML = playButtonTemplate;
//        currentlyPlayingSong = null;
//    } else if (currentlyPlayingSong !== songItem.getAttribute('data-song-number')) {
//        var currentlyPlayingSongElement = document.querySelector('[data-song-number="'+currentlyPlayingSong+'"]');
//        // change currently playing song from pause button to song number
//        currentlyPlayingSongElement.innerHTML = currentlyPlayingSongElement.getAttribute('data-song-number');
//        // change new song to pause button
//        songItem.innerHTML = pauseButtonTemplate;
//        // save currently playing song number
//        currentlyPlayingSong = songItem.getAttribute('data-song-number');
//    }
//};

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

//var songListContainer = document.getElementsByClassName('album-view-song-list')[0];
//var songRows = document.getElementsByClassName('album-view-song-item');
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var currentlyPlayingSong = null;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
    cover.addEventListener('click', rotateAlbum);
});


