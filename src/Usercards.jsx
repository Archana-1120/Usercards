import { useState, useEffect } from "react";
import axios from "axios";

function UserCards() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newItem, setNewItem] = useState({ name: "" });
  const [editingItem, setEditingItem] = useState(null);

const API_URL = "https://fakestoreapi.com/products";

  // --- READ ---
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(API_URL);
        const mappedItems = response.data.slice(0, 10).map((post) => ({
          id: post.id,
          name: post.title,
        }));
        setPosts(mappedItems);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  // --- CREATE ---
  const handleCreate = async (e) => {
    e.preventDefault();
    const postData = {
      title: newItem.name,
      body: "Default content",
      userId: 1,
    };

    try {
      const response = await axios.post(API_URL, postData);
      const createdItem = {
        id: response.data.id,
        name: response.data.title,
      };
      setPosts([...posts, createdItem]);
      setNewItem({ name: "" });
    } catch (error) {
      console.error("Error creating item:", error);
    }
  };

  // --- UPDATE ---
  const handleUpdate = async (e) => {
    e.preventDefault();
    const postData = {
      id: editingItem.id,
      title: editingItem.name,
      body: "Updated content",
      userId: 1,
    };

    try {
      const response = await axios.put(`${API_URL}/${editingItem.id}`, postData);
      const updatedItem = {
        id: response.data.id,
        name: response.data.title,
      };
      setPosts(posts.map((p) => (p.id === updatedItem.id ? updatedItem : p)));
      setEditingItem(null);
    } catch (error) {
      console.error("Error updating item:", error);
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);
      setPosts(posts.filter((p) => p.id !== id));
    } catch (error) {
      console.error("Error deleting item:", error);
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <h2>React CRUD Example</h2>

      <form onSubmit={editingItem ? handleUpdate : handleCreate}>
        <input
          type="text"
          placeholder="Enter title"
          value={editingItem ? editingItem.name : newItem.name}
          onChange={(e) =>
            editingItem
              ? setEditingItem({ ...editingItem, name: e.target.value })
              : setNewItem({ ...newItem, name: e.target.value })
          }
          required
        />
        <button type="submit">{editingItem ? "Update" : "Add"}</button>
        {editingItem && (
          <button type="button" onClick={() => setEditingItem(null)}>
            Cancel
          </button>
        )}
      </form>

      <div>
        {posts.map((post) => (
          <div key={post.id}>
            <h3>{post.name}</h3>
            <button onClick={() => setEditingItem(post)}>Edit</button>
            <button onClick={() => handleDelete(post.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default UserCards;
