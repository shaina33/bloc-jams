var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + songLength + '</td>'
      + '</tr>'
      ;
     var onHover = function() {
        // 'this' = a song row
        var $songItem = $(this).find('.song-item-number');
        var $songItemNumber = parseInt($songItem.attr('data-song-number'));
        if ($songItemNumber !== currentlyPlayingSongNumber) {
            $songItem.html(playButtonTemplate);
        }
     };
     var offHover = function() {
        // 'this' = a song row
        var $songItem = $(this).find('.song-item-number');
        var $songItemNumber = parseInt($songItem.attr('data-song-number'));
        if ($songItemNumber !== currentlyPlayingSongNumber) {
            $songItem.html($songItemNumber);
        }
     };
     var clickHandler = function() {
        // 'this' = song-item-number element within a row
        var $songItem = $(this);
        console.log("clickHandler called");
        console.log($songItem);
        var $songItemNumber = parseInt($songItem.attr('data-song-number'));
        if (currentlyPlayingSongNumber === null) {
            // no song playing, clicked to play
            $songItem.html(pauseButtonTemplate);
            setSong($songItemNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        } else if (currentlyPlayingSongNumber === $songItemNumber) {
            // clicked same song
            if ( currentSoundFile.isPaused() ) {
                currentSoundFile.play();
                $songItem.html(pauseButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPauseButton);
            } else {
                currentSoundFile.pause();
                $songItem.html(playButtonTemplate);
                $('.main-controls .play-pause').html(playerBarPlayButton);
            }
        } else if (currentlyPlayingSongNumber !== $songItemNumber) {
            // clicked to play a different song
            var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
            $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
            $songItem.html(pauseButtonTemplate);
            setSong($songItemNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
        }
     };
 
     var $row = $(template);
     $row.find('.song-item-number').click(clickHandler);
     $row.hover(onHover, offHover);
     return $row;
     
 };

 var setCurrentAlbum = function(album) {
     currentAlbum = album;
     
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

var trackIndex = function(album, song) {
    return album.songs.indexOf(song);
};

var rotateAlbum = function() {
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

var updatePlayerBarSong = function() {
    var $playerBarSong = $('.song-name');
    var $playerBarArtist = $('.artist-name');
    var $playerBarMobile = $('.artist-song-mobile');
    
    $playerBarSong.text(currentSongFromAlbum.title);
    $playerBarArtist.text(currentAlbum.artist);
    $playerBarMobile.text(currentSongFromAlbum.title+" - "+currentAlbum.artist);
    
    $('.main-controls .play-pause').html(playerBarPauseButton);
};

var nextSong = function() {
    var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    
    if (currentlyPlayingSongNumber == currentAlbum.songs.length) {
        setSong(1);
    } else {
        setSong(currentlyPlayingSongNumber + 1);
    }
    updatePlayerBarSong();
    currentSoundFile.play();
    
    $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(pauseButtonTemplate);
};

var previousSong = function() {
    var $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(currentlyPlayingSongNumber);
    
    if (currentlyPlayingSongNumber <= 1) {
        setSong(currentAlbum.songs.length);
    } else {
        setSong(currentlyPlayingSongNumber - 1);
    }
    updatePlayerBarSong();
    currentSoundFile.play();
    
    $currentlyPlayingSongElement = getSongNumberCell(currentlyPlayingSongNumber);
    $currentlyPlayingSongElement.html(pauseButtonTemplate);
};

var setSong = function(songNumber) {
    if (currentSoundFile) {
        currentSoundFile.stop();
    }
    currentlyPlayingSongNumber = parseInt(songNumber);
    currentSongFromAlbum = (songNumber) ? currentAlbum.songs[songNumber-1] : null;
    currentSoundFile = new buzz.sound(currentSongFromAlbum.audioURL, {
        formats: [ 'mp3'],
        preload: true
    });
    setVolume(currentVolume);
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
    if (!currentSoundFile) {
        setSong(1);
        currentSoundFile.pause();
    }
    if ( currentSoundFile.isPaused() ) {
        getSongNumberCell(currentlyPlayingSongNumber).html(pauseButtonTemplate);
        $playpauseButton.html(playerBarPauseButton);
        currentSoundFile.play();
    } else {
        getSongNumberCell(currentlyPlayingSongNumber).html(playButtonTemplate);
        $playpauseButton.html(playerBarPlayButton);
        currentSoundFile.pause();
    }
};

// global variables
var playButtonTemplate = '<a class="album-song-button"><span class="ion-play"></span></a>';
var pauseButtonTemplate = '<a class="album-song-button"><span class="ion-pause"></span></a>';
var playerBarPlayButton = '<span class="ion-play"></span>';
var playerBarPauseButton = '<span class="ion-pause"></span>';
var $previousButton = $('.main-controls .previous');
var $nextButton = $('.main-controls .next');
var $playpauseButton = $('.main-controls .play-pause');

var albumDatabase = [albumPicasso, albumMarconi, albumATE];
var cover = document.getElementsByClassName('album-cover-art')[0];

var currentAlbum = null;
var currentlyPlayingSongNumber = null;
var currentSongFromAlbum = null;
var currentSoundFile = null;
var currentVolume = 80;

$(document).ready(function() {
    setCurrentAlbum(albumPicasso);
        // setCurrentAlbum builds album song list, which includes click listeners on song rows for play/pause
    cover.addEventListener('click', rotateAlbum);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playpauseButton.click(togglePlayFromPlayerBar)
});


