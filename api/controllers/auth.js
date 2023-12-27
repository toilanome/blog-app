import User from "../models/User.js";
import Post from "../models/Post.js";
import Category from "../models/Categories.js";
import dotenv from "dotenv";
import { signInValidate, signUpValidate } from "../validate/User.js";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import multer from "multer";
import fs from "fs";
import Comments from "../models/Comments.js";
import { log } from "console";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../configs/Cloud.js";
dotenv.config();

const { SECRET_KEY } = process.env;

export const signUp = async (req, res) => {
  try {
    const { error } = signUpValidate.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        message: errors,
      });
    }
    const UserExist = await User.findOne({ email: req.body.email });
    if (UserExist) {
      return res.status(400).json({
        message: "Email đã tồn tại",
      });
    }

    const hashPassword = await bcryptjs.hash(req.body.password, 10);
    const userAccount = await User.create({
      ...req.body,
      password: hashPassword,
    });
    if (!userAccount) {
      throw new Error("Failed!");
    }
    userAccount.password = undefined;
    return res.status(200).json({
      message: "Đăng kí thành công",
      data: userAccount,
    });
  } catch (error) {
    return res.json({
      name: error.name,
      message: error.message,
    });
  }
};

export const signIn = async (req, res) => {
  try {
    const { error } = signInValidate.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((err) => err.message);

      return res.status(400).json({
        message: errors,
      });
    }
    const UserExist = await User.findOne({ email: req.body.email });
    if (!UserExist) {
      return res.status(400).json({
        message: "Email chưa tồn tại. Bạn có muốn đăng ký không",
      });
    }
    const isMatch = await bcryptjs.compare(
      req.body.password,
      UserExist.password
    );
    if (!isMatch) {
      return res.status(400).json({
        message: "Mật khẩu không khớp ",
      });
    }

    const accessToken = jwt.sign({ _id: UserExist._id }, SECRET_KEY, {
      expiresIn: "1d",
    });

    UserExist.password = undefined;
    return res.status(200).json({
      message: "Đăng nhập thành công",
      data: UserExist,
      accessToken,
    });
  } catch (error) {
    return res.json({
      name: error.name,
      message: error.message,
    });
  }
};

export const getUserDetail = async (req, res) => {
  const { _id } = req.user;
  // select dùng để giấu các trường không mong muốn bị lộ
  const response = await User.findById(_id).select("-password");

  return res.status(200).json({
    message: "Gọi users thành công",
    response,
  });
};

  export const post = async (req, res) => {
    try {
      const userId = req.user._id;

      // Use the user ID to fetch user details from the database
      const user = await User.findById(userId).select("-password");
      const userName = user.userName;

      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }


      const { title, summary, content, categoryName } = req.body;
  

      const cloudGetUrl = await cloudinary.uploader.upload(req.file.path, {
        folder:"BANK",
        allowed_formats: ['jpg', 'png','jpeg'],
        transformation:[{width:500,height:500, crop:'limit'}]
      })
      // Find or create the category based on the provided name
      const category = await Category.findOrCreate({ name: categoryName });

      // Create the post document with the categoryId
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover:cloudGetUrl.secure_url,
        author: user._id,
        category: category._id, // A  ssign the category to the post
      });

      // Update the category to include the newly created post
      const updateCategory = await Category.findByIdAndUpdate(category._id, {
        $addToSet: {
          posts: postDoc._id,
        },
      });

      if (!updateCategory) {
        return res.status(400).json({
          message: "Update category failed",
        });
      }

      // Populate the userName field in the author property
      await postDoc.populate("author", "userName");

      console.log("post ", postDoc);

      return res.status(200).json({
        success: postDoc ? true : false,
        message: postDoc ? postDoc : "Create post failed",
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };

  export const updatePost = async (req, res) => {
    try {
      const { id } = req.params;
      const userId = req.user._id;
      const post = await Post.findById(id);
  
      if (!post) {
        return res.status(404).json({ error: "Post not found" });
      }
  
      const { title, summary, content, categoryName } = req.body;
  
      let cloudGetUrl;
      
      // Check if a new image file is provided
      if (req.file) {
        cloudGetUrl = await cloudinary.uploader.upload(req.file.path, {
          folder: "BANK",
          allowed_formats: ['jpg', 'png', 'jpeg'],
          transformation: [{ width: 500, height: 500, crop: 'limit' }],
        });
      }
  
      const isAuthor = JSON.stringify(post?.author?._id) === JSON.stringify(userId);
  
      if (!isAuthor) {
        return res.status(400).json("Bạn không phải tác giả");
      } 
  
      let categoryId = null;
  
      if (categoryName) {
        const category = await Category.findOne({ name: categoryName });
        categoryId = category?._id;
      }
  
      console.log("Updating post with ID:", id);
  
      // Create an object to hold the updated post data
      const updatedPostData = {
        title,
        summary,
        content,
        ...(cloudGetUrl && { cover: cloudGetUrl.secure_url }), // Update cover only if a new image is provided
        ...(categoryId && { category: categoryId }), // Update category only if categoryName is provided
      };
  
      const updatedPost = await Post.findByIdAndUpdate(
        id,
        updatedPostData,
        { new: true } // This option returns the updated document
      ).populate({
        path: "category",
        select: "name",
      });
  
      // Update the categories
      if (post.category !== categoryId) {
        // Remove post from the old category
        await Category.updateOne(
          { _id: post.category },
          { $pull: { posts: post._id } }
        );
  
        // Add post to the new category
        if (categoryId) {
          await Category.updateOne(
            { _id: categoryId },
            { $addToSet: { posts: post._id } }
          );
        }
      }
  
      console.log("Updated post:", updatedPost);
  
      res.status(200).json({
        message: "Post updated successfully",
        updatedPost,
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "Internal Server Error" });
    }
  };
  
  

export const getSinglePage = async (req, res) => {
  try {
    const { id } = req.params;
    const postDoc = await Post.findById(id)
                    .populate({
                      path:"author",
                      select: "userName"
                    })
                    .populate({
                      path:"category",
                      select: "name"
                    })
                    .populate({
                      path : "comments",
                      select: "comment userName users"
                    })
    res.status(200).json({
      message: "gọi post thành công",
      postDoc,
    });
  } catch (error) {}
};

export const getPost = async (req, res) => {
  try {
    const allPost = await Post.find()
      .populate({
        path: "author",
        select: "userName",
      })
      .populate({
        path: "category",
        select: "name",
      })
      .populate({
        path : "comments",
        select: "comment userName"
      })
      .sort({});
    return res.status(200).json({
      message: "gọi bài viết thành công",
      allPost,
    });
  } catch (error) {}
};

export const deletePost = async (req, res) => {
  try {
    const { id } = req.params;
    const remove = await Post.findByIdAndDelete(id);

    return res.status(200).json({
      message: "xóa bài viết thành công",
      remove,
    });
  } catch (error) {}
};


