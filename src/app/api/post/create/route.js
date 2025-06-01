import Post from "../../../../lib/models/post.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";
import { currentUser } from "@clerk/nextjs/server";
export const POST = async (req) => {
  const user = await currentUser();
  try {
    await connect();
    const data = await req.json();

    console.log("Request data:", data); // 添加调试日志
    console.log("User metadata:", user?.publicMetadata); // 添加调试日志

    if (
      !user ||
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 401,
        headers: { "Content-Type": "application/json" },
      });
    }

    const slug = data.title
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.imageUrl, // 修改这里，使用imageUrl而不是image
      category: data.category,
      slug,
    });

    // 这行是多余的，Post.create已经保存了文档
    await newPost.save();

    return new Response(JSON.stringify(newPost), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.log("Error creating post:", error);
    return new Response(JSON.stringify({ message: error.message }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
