import path from "path";
import fs from "fs/promises";
import html from "remark-html";
import { remark } from "remark";

const EditorPage = ({ posts }) => {
  return (
    <div>
      <h1>MARKDOWN FILES TO HTML</h1>
      <span> upload your md files in public/posts whit any name you want </span>
      {posts.map((post, index) => (
        <div
          key={index}
          style={{
            marginBottom: "40px",
            borderBottom: "1px solid #ccc",
            paddingBottom: "20px",
          }}
        >
          <h2 style={{ color: "#333", fontSize: "24px", marginBottom: "10px" }}>
            FILE NAME : {post.fileName}
          </h2>
          <div dangerouslySetInnerHTML={{ __html: post.contentHtml }} />
        </div>
      ))}
    </div>
  );
};

export default EditorPage;

export async function getStaticProps() {
  const FOLDER_PATH = path.join(process.cwd(), `public/posts`);

  try {
    const files = await fs.readdir(FOLDER_PATH);
    const markdownFiles = files.filter((file) => file.endsWith(".md"));

    const posts = await Promise.all(
      markdownFiles.map(async (file) => {
        const filePath = path.join(FOLDER_PATH, file);
        const fileContents = await fs.readFile(filePath, "utf8");
        const processedContent = await remark().use(html).process(fileContents);
        const contentHtml = processedContent.toString();

        return {
          fileName: file.replace(/\.md$/, ""),
          contentHtml,
        };
      })
    );

    return {
      props: { posts },
    };
  } catch (error) {
    console.error("Error reading files:", error);
    return {
      props: {
        posts: [
          { fileName: "Error", contentHtml: "<p>Error loading content.</p>" },
        ],
      },
    };
  }
}
