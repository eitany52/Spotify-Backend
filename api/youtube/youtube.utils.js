export function _addDurationToSongs(songs, songsAdditionalInfo) {
    songs.forEach(song => {
        const songAdditionalInfo = songsAdditionalInfo.find(songAdditionalInfo => songAdditionalInfo.id === song.id.videoId)
        if (songAdditionalInfo) {
            song.duration = songAdditionalInfo.contentDetails.duration
        }
    })
}

export function _getSongIds(songs) {
    const songIds = []
    songs.forEach(song => {
        songIds.push(song.id.videoId)
    })

    return songIds
}