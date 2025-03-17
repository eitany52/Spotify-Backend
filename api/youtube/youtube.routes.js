import express from 'express'

const router = express.Router()

router.get('/songs', getSongs)

export const youtubeRoutes = router