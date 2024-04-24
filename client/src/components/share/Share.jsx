import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import "./share.scss";
import Image from "../../assets/img.png";
import Map from "../../assets/map.png";
import Friend from "../../assets/friend.png";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/authContext";

const Share = () => {
  const { currentUser } = useContext(AuthContext);
  const [file, setFile] = useState(null);
  const [desc, setDesc] = useState("");
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("desc", desc);
      const response = await axios.post(
        "http://localhost:8800/api/post/create",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );
      return response.data;
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ["posts"] });
    },
  });

  const handleClick = async (e) => {
    e.preventDefault();
    await mutation.mutate();
    setDesc("");
  };

  return (
    <div className="share">
      <div className="container">
        <div className="top">
          <img src={currentUser.profilePic} alt="" />
          <input
            type="text"
            placeholder={`What's on your mind ${currentUser.name}?`}
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
        </div>
        <hr />
        <div className="bottom">
          <div className="left">
            <input
              type="file"
              id="file"
              name="file"
              style={{ display: "none" }}
              onChange={(e) => setFile(e.target.files[0])}
            />
            <label htmlFor="file">
              <div className="item">
                <img src={Image} alt="" />
                <span>Add Image</span>
              </div>
            </label>
            <div className="item">
              <img src={Map} alt="" />
              <span>Add Place</span>
            </div>
            <div className="item">
              <img src={Friend} alt="" />
              <span>Tag Friends</span>
            </div>
          </div>
          <div className="right">
            <button onClick={handleClick}>Share</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Share;
