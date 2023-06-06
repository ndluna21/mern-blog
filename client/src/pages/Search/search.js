import React, { useState } from 'react';
import axios from 'axios';

export default function Search() {
  const [keyword, setKeyword] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`/api/post/search?keyword=${keyword}`);
      setResults(response.data);
    } catch (error) {
      console.log('Lỗi tìm kiếm:', error);
    }
  };

  return (
    <div>
      <input
        type="text"
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />
      <button onClick={handleSearch}>Tìm kiếm</button>

      <ul>
        {results.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.author}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};
