import pool from "../database.js";
import moment from "moment";
import multer from "multer";
import dotenv from "dotenv";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
dotenv.config();

const bucketName = process.env.BUCKET_NAME;
const bucketRegion = process.env.BUCKET_REGION;
const accessKey = process.env.ACCESS_KEY;
const secretAccessKey = process.env.SECRET_ACCESS_KEY;

const s3 = new S3Client({
  credentials: {
    accessKeyId: accessKey,
    secretAccessKey: secretAccessKey,
  },
  region: bucketRegion,
});

console.log(s3);

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const getPosts = async (req, res, next) => {
  try {
    const userId = req.session.userId;
    const query =
      "SELECT p.*, u.id AS userId, username, profile FROM posts AS p INNER JOIN users AS u ON (u.id = p.user_id) LEFT JOIN relationships AS r ON p.user_id = r.followed_user_id WHERE r.follower_user_id = ? OR p.user_id = ? ORDER BY p.createdAt DESC";
    const [posts] = await pool.query(query, [userId, userId]);
    // console.log(posts);
    res.status(200).json(posts);
  } catch (err) {
    next(err);
  }
};

export const uploadPostImage = upload.single("file");

export const createPost = async (req, res, next) => {
  try {
    console.log("🔥");
    console.log(req.file);
    console.log(req.body);
    console.log("🚀");
    const { userId } = req.session;
    const uploadParams = {
      Bucket: bucketName,
      Key: req.file.originalname,
      Body: req.file.buffer,
      ContentType: req.file.mimetype,
    };

    const { desc, img } = req.body;
    const command = new PutObjectCommand(uploadParams);
    await s3.send(command);
    console.log("line 56");
    const query =
      "INSERT INTO `social`.`posts` ( `user_id`, `desc`, `img`, `createdAt`) VALUES ( ?, ?, ?, ?);";
    const newPost = [
      userId,
      desc,
      img,
      moment(Date.now()).format("YYYY-MM-DD HH:mm:ss"),
    ];
    await pool.query(query, newPost);
    res.status(201).json("post has been created");
  } catch (err) {
    console.log(err);
    next(err);
  }
};
