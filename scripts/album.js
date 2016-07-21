var createSongRow = function(songNumber, songName, songLength) {
     var template =
        '<tr class="album-view-song-item">'
      + '  <td class="song-item-number" data-song-number="' + songNumber + '">' + songNumber + '</td>'
      + '  <td class="song-item-title">' + songName + '</td>'
      + '  <td class="song-item-duration">' + filterTimeCode(songLength) + '</td>'
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
        var $songItemNumber = parseInt($songItem.attr('data-song-number'));
        if (currentlyPlayingSongNumber === null) {
            // no song playing, clicked to play
            $songItem.html(pauseButtonTemplate);
            setSong($songItemNumber);
            updatePlayerBarSong();
            currentSoundFile.play();
            updateSeekBarWhileSongPlays();
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
            updateSeekBarWhileSongPlays();
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

var updateSeekPercentage = function($seekBar, seekBarFillRatio) {
    var offsetXPercent = seekBarFillRatio * 100;
    offsetXPercent = Math.max(0, offsetXPercent);
    offsetXPercent = Math.min(100, offsetXPercent);
    var percentageString = offsetXPercent+'%';
    $seekBar.find('.fill').width(percentageString);
    $seekBar.find('.thumb').css({ left: percentageString });
};

var setupSeekBars = function() {
    updateSeekPercentage( $('.volume .seek-bar'), currentVolume/100 );
    var $seekBars = $('.player-bar .seek-bar');
    $seekBars.click(function(event) {
        var offsetX = event.pageX - $(this).offset().left;
        var barWidth = $(this).width();
        var seekBarFillRatio = offsetX / barWidth;
        updateSeekPercentage($(this), seekBarFillRatio);
        if ( $(this).parent().hasClass('seek-control') ) {
            seek( seekBarFillRatio * currentSoundFile.getDuration() );
        } else {
            setVolume(seekBarFillRatio * 100);
        }
    });
    $seekBars.find('.thumb').mousedown( function(event) {
        var $seekBar = $(this).parent();
        var seekBarFillRatio;
        $(document).bind('mousemove.thumb', function(event) {
            var offsetX = event.pageX - $seekBar.offset().left;
            var barWidth = $seekBar.width();
            //var seekBarFillRatio = offsetX / barWidth;
            seekBarFillRatio = offsetX / barWidth;
            updateSeekPercentage($seekBar, seekBarFillRatio);
            if ( $(this).parent().hasClass('seek-control') ) {
                seek( seekBarFillRatio * currentSoundFile.getDuration() );
            } else {
                setVolume(seekBarFillRatio * 100);
            }
        });
        $(document).bind('mouseup.thumb', function() {
            $(document).unbind('mousemove.thumb');
            $(document).unbind('mouseup.thumb');
        });
    });
};

var updateSeekBarWhileSongPlays = function() {
    if (currentSoundFile) {
        currentSoundFile.bind('timeupdate', function(event) {
            var seekBarFillRatio = this.getTime() / this.getDuration();
            var $seekBar = $('.seek-control .seek-bar');
            updateSeekPercentage($seekBar, seekBarFillRatio);
            setCurrentTimeInPlayerBar(currentSoundFile.getTime());
        });
    }
};

var updatePlayerBarSong = function() {
    var $playerBarSong = $('.song-name');
    var $playerBarArtist = $('.artist-name');
    var $playerBarMobile = $('.artist-song-mobile');
    
    $playerBarSong.text(currentSongFromAlbum.title);
    $playerBarArtist.text(currentAlbum.artist);
    $playerBarMobile.text(currentSongFromAlbum.title+" - "+currentAlbum.artist);
    setTotalTimeInPlayerBar(currentSongFromAlbum.duration)
    
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
    updateSeekBarWhileSongPlays();
    
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
    updateSeekBarWhileSongPlays();
    
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

var seek = function(time) {
    if (currentSoundFile) {
        currentSoundFile.setTime(time);
    }
};

var setVolume = function(volume) {
    if (currentSoundFile) {
        currentSoundFile.setVolume(volume);
    }
    currentVolume = volume;
};

var getSongNumberCell = function(number) {
    return $('.song-item-number[data-song-number="' + number + '"]');
};

var togglePlayFromPlayerBar = function() {
//    if (!currentSoundFile) {
//        setSong(1);
//        currentSoundFile.pause();
//    }
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

var setCurrentTimeInPlayerBar = function(currentTime) {
    $('.current-time').text(filterTimeCode(currentTime));
};
var setTotalTimeInPlayerBar = function(totalTime) {
    $('.total-time').text(filterTimeCode(totalTime));
};
var filterTimeCode = function(timeinSeconds) {
    timeinSeconds = parseFloat(timeinSeconds);
    wholeMins = Math.floor(timeinSeconds / 60);
    wholeSecs = Math.floor(timeinSeconds % 60);
    if (wholeSecs < 10) {
        wholeSecs = "0"+wholeSecs;
    }
    return wholeMins+":"+wholeSecs;
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
    setupSeekBars();
    cover.addEventListener('click', rotateAlbum);
    $previousButton.click(previousSong);
    $nextButton.click(nextSong);
    $playpauseButton.click(togglePlayFromPlayerBar)
});


