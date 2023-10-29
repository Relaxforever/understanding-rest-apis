import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [posts, setPosts] = useState([]);
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostBody, setNewPostBody] = useState('');
  const [serverData, setServerData] = useState([]);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/posts')
      .then(response => response.json())
      .then(data => setPosts(data.slice(0, 10)));
  }, []);

  const handleAddPost = () => {
    const newPost = {
      title: newPostTitle,
      body: newPostBody,
      userId: 1
    };

    fetch('https://jsonplaceholder.typicode.com/posts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(newPost)
    })
      .then(response => response.json())
      .then(data => {
        setPosts(prevPosts => [data, ...prevPosts]);
        setServerData(prevData => [data, ...prevData]);
        setNewPostTitle('');
        setNewPostBody('');
      });
  };

  const handleUpdatePost = (id) => {
    const updatedPost = {
      title: 'Título Actualizado',
      body: 'Contenido Actualizado',
      userId: 1
    };

    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatedPost)
    })
    .then(response => response.json())
    .then(data => {
      setPosts(prevPosts => prevPosts.map(post => post.id === id ? data : post));
      setServerData(prevData => prevData.map(data => data.id === id ? { ...data, ...updatedPost } : data));
    });
  };

  const handleDeletePost = (id) => {
    fetch(`https://jsonplaceholder.typicode.com/posts/${id}`, {
      method: 'DELETE',
    })
    .then(() => {
      setPosts(prevPosts => prevPosts.filter(post => post.id !== id));
      setServerData(prevData => prevData.filter(data => data.id !== id));
    });
  };

  return (
    <div style={{ display: 'flex', width: '100%' }}>
      {/* Client Section */}
      <div className="container">
        <label>Client</label>
        <input
          type="text"
          placeholder="Title"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
        />
        <textarea
          placeholder="Body"
          value={newPostBody}
          onChange={(e) => setNewPostBody(e.target.value)}
        />
        <button onClick={handleAddPost}>Agregar Post</button>
      </div>

      {/* API Section */}
      <div className="container">
        <label>REST API</label>
        <ul>
          {posts.map(post => (
            <li key={post.id}>
              <strong>{post.title}</strong>
              <p>{post.body}</p>
              <button onClick={() => handleUpdatePost(post.id)}>Actualizar</button>
              <button onClick={() => handleDeletePost(post.id)}>Eliminar</button>
            </li>
          ))}
        </ul>
      </div>

      {/* Server Section */}
      <div className="container">
        <label>Server</label>
        <ul>
          {serverData.map((data, index) => (
            <li key={index}>
              <strong>{data.title}</strong>
              <p>{data.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
