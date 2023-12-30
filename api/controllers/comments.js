import User from "../models/User.js";
import Post from "../models/Post.js";
import dotenv from "dotenv";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import Comments from "../models/Comments.js";
dotenv.config();

const { SECRET_KEY } = process.env;

export const CreateComments = async (req, res) => {
  const userId = req.user._id;
  const isUser = await User.findById(userId).select("-password");
  if (!isUser) {
    return res.status(400).json("User không tồn tại");
  }
  console.log("user check  ", isUser);
  const { comment, posts } = req.body;
  if (!comment || !posts) {
    return res.status(400).json("Bạn chưa nhập comment hoặc postId");
  }

  try {
    const newComment = await Comments.create({
      comment,
      users: userId,
      posts,
      userName: isUser.userName,
      avatar: isUser.avatar
    });

    await newComment.populate("posts", "title");
    await Post.findByIdAndUpdate(posts, {
      $push: { comments: newComment._id },
    });
    return res.status(200).json({
      message: "Đã bình luận thành công",
      newComment,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Đã xảy ra lỗi khi xử lý yêu cầu",
    });
  }
};

export const deleteCommentsByUser = async (req, res) => {
  const { id } = req.params;
  const userId = req.user._id;
  const isUser = await User.findById(userId).select("-password");
  if (!isUser) {
    return res.status(400).json("User không tồn tại");
  }
  console.log("user check  ", isUser);

  try {

    const deleteComment =  await Comments.findByIdAndDelete(id)

    return res.status(200).json({
        message: "Xóa bình luận thành công",
        deleteComment
      });
  } catch (error) {
      return res.status(400).json({
        message: "Xóa bình luận thất bại ",
      });
  }


};

export const getCommentsByUser = async (req, res) => {
  

  try {

    const getComment =  await Comments.find()

    return res.status(200).json({
        message: "Lấy toàn bộ bình luận thành công",
        getComment
      });
  } catch (error) {
      return res.status(400).json({
        message: "Lấy bình luận thất bại ",
      });
  }


};

export const updateCommentsByUser = async (req, res) => {
  const {id} = req.params
  const userId = req.user._id;
  const isUser = await User.findById(userId).select("-password");
  if (!isUser) {
    return res.status(400).json("User không tồn tại");
  }
  console.log("user check  ", isUser);

  const { comment } = req.body;

  

  try {
    const newCommentUpdate = await Comments.findByIdAndUpdate(id, {
      comment,
      
    }, {new:true});

    await newCommentUpdate.populate("posts", "title");
   
    return res.status(200).json({
      message: "Update bình luận thành công",
      newCommentUpdate,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Đã xảy ra lỗi khi xử lý yêu cầu",
    });
  }
};