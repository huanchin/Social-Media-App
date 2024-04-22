import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";

const Posts = () => {
  const { isLoading, isError, data, error, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        console.log("Hello");
        const response = await axios.get("http://localhost:8800/api/post");
        console.log("Query function executed successfully");
        console.log("Response data:", response.data);
        return response.data;
      } catch (error) {
        console.error("Error fetching data:", error);
        throw new Error("Failed to fetch posts");
      }
    },
  });

  console.log("isLoading:", isLoading);
  console.log("isError:", isError);
  console.log("data:", data);
  console.log("error:", error);
  console.log("isFetching:", isFetching); // Check if a request is in-flight

  return (
    <div className="posts">
      {data & data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
