import { Router } from "express";
const router = Router()

router.get('/', (req, res) => {
    res.render('login')
})

router.get('/chat', (req, res) => {
    const { username } = req.query
    res.render('chat', {username})

})

export default router