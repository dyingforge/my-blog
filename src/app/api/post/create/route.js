import Post from "../../../../lib/models/post.model.js";
import { connect } from "../../../../lib/mongodb/mongoose.js";
import { currentUser } from "@clerk/nextjs/server";

export const POST = async (req) => {
  try {
    const user = await currentUser();

    if (!user) {
      return new Response(
        JSON.stringify({ message: "User not authenticated" }),
        {
          status: 401,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    await connect();
    const data = await req.json();

    console.log("Request data:", data);
    console.log("User metadata:", user?.publicMetadata);

    // 验证用户权限
    if (
      user.publicMetadata.userMongoId !== data.userMongoId ||
      user.publicMetadata.isAdmin !== true
    ) {
      return new Response(JSON.stringify({ message: "Unauthorized" }), {
        status: 403,
        headers: { "Content-Type": "application/json" },
      });
    }

    // 验证必填字段
    if (!data.title || !data.content) {
      return new Response(
        JSON.stringify({ message: "Title and content are required" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 生成 slug
    const slug = data.title
      .trim()
      .split(" ")
      .join("-")
      .toLowerCase()
      .replace(/[^a-zA-Z0-9-]/g, "");

    // 检查 slug 是否已存在
    const existingPost = await Post.findOne({ slug });
    if (existingPost) {
      return new Response(
        JSON.stringify({ message: "A post with this title already exists" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // 创建新 Post
    const newPost = await Post.create({
      userId: user.publicMetadata.userMongoId,
      content: data.content,
      title: data.title,
      image: data.imageUrl || "", // 使用 imageUrl
      category: data.category || "uncategorized",
      slug,
    });

    return new Response(JSON.stringify(newPost), {
      status: 201, // 使用 201 表示创建成功
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error creating post:", error);

    // 处理重复键错误
    if (error.code === 11000) {
      const field = Object.keys(error.keyPattern)[0];
      return new Response(
        JSON.stringify({ message: `A post with this ${field} already exists` }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    return new Response(JSON.stringify({ message: "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
};
