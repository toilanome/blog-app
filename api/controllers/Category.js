import Category from "../models/Categories.js"

export const createCategory = async(req,res) =>{
    const category = new Category({
        name: req.body.name,
        
      });
    
      try {
        const newCategory = await category.save();
        res.status(201).json({
            message: "tạo category thành công",
            newCategory
        }); 
      } catch (error) {
        res.status(400).json({ message: error.message });
      }
}

export const getCategory = async(req,res) =>{
    try {
        const categories = await Category.find().populate({
            path: 'posts',
            // lấy thông tin của cả user
            populate: {
                path: 'author',
                select: 'userName', // Select the fields you want to include
            },
        })
        res.json(categories);
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
}

export const getDetailCategory = async(req,res) =>{
  try {
    const{id} = req.params
      const categories = await Category.findById(id).populate({
          path: 'posts',
          // lấy thông tin của cả user
          populate: {
              path: 'author',
              select: 'userName', // Select the fields you want to include
          },
      })
      res.json(categories);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
}
// export const deleteCategory = async(req,res) =>{
//     try {
//         const categories = await Category.find().populate({
//             path: 'posts',
//             // lấy thông tin của cả user
//             populate: {
//                 path: 'author',
//                 select: 'userName', // Select the fields you want to include
//             },
//         })
//         res.json(categories);
//       } catch (error) {
//         res.status(500).json({ message: error.message });
//       }
// }