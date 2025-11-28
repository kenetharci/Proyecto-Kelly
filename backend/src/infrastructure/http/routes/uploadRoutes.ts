import { Router } from "express"
import multer from "multer"
import path from "path"
import fs from "fs"

const router = Router()

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = path.join(__dirname, "../../../../uploads")
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true })
        }
        cb(null, uploadDir)
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9)
        cb(null, uniqueSuffix + path.extname(file.originalname))
    },
})

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        if (file.mimetype.startsWith("image/")) {
            cb(null, true)
        } else {
            cb(new Error("Only images are allowed"))
        }
    }
})

router.post("/", upload.single("image"), (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: "No image uploaded" })
        }

        // Return the URL to access the image
        const protocol = req.protocol
        const host = req.get("host")
        const imageUrl = `${protocol}://${host}/uploads/${req.file.filename}`

        res.json({ url: imageUrl })
    } catch (error) {
        console.error("Error uploading image:", error)
        res.status(500).json({ error: "Failed to upload image" })
    }
})

export default router
