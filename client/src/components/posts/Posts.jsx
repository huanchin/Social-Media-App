import Post from "../post/Post";
import "./posts.scss";
import { useQuery } from "@tanstack/react-query";
import { makeRequest } from "../../axios";
import axios from "axios";
import { useEffect, useState } from "react";

const Posts = () => {
  // const [posts, setPosts] = useState([]);
  // useEffect(() => {
  //   const fetchPosts = async () => {
  //     try {
  //       const response = await axios.get("http://localhost:8800/api/post", {
  //         withCredentials: true,
  //       });
  //       setPosts(response.data);
  //     } catch (error) {
  //       throw new Error("Failed to fetch posts");
  //     }
  //   };
  //   fetchPosts();
  // }, []);
  // console.log(posts);
  const { isLoading, isError, data, error, isFetching } = useQuery({
    queryKey: ["posts"],
    queryFn: async () => {
      try {
        console.log("Hello");
        const response = await axios.get("http://localhost:8800/api/post", {
          withCredentials: true,
        });
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
      {data && data.map((post) => <Post post={post} key={post.id} />)}
    </div>
  );
};

export default Posts;
