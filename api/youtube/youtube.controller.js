import config from "../../config/config";
import { logger } from "../../services/logger.service";
import { getSongIds, addDurationToSongs } from "./youtube.utils.js";

export async function getSongs(req, res) {
    try {
        let { searchTerm, maxResults } = req.query()
        searchTerm = searchTerm ? searchTerm : 'rap'
        maxResults = maxResults && maxResults > 0 ? maxResults : 4
        const API_KEY = config.apiKey
        let result = await fetch(`https://www.googleapis.com/youtube/v3/search?q=${searchTerm}&part=snippet&type=video&videoCategoryId=10&maxResults=${maxResults}&key=${API_KEY}`)
        let data = await result.json()
        let songs = data.items
        const songIds = getSongIds(songs)
        const songIdsStr = songIds.join(',')
        result = await fetch(`https://www.googleapis.com/youtube/v3/videos?part=contentDetails&id=${songIdsStr}&key=${API_KEY}`)
        data = await result.json()
        const songsAdditionalInfo = data.items
        addDurationToSongs(songs, songsAdditionalInfo)
        songs = songs.filter(song => song.duration)
        res.json(songs)
    } catch (error) {
        logger.error("Failed to get songs from youtube", error)
        res.status(400).send({ err: "Failed to get songs" })
    }
}