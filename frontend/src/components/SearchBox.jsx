import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
const backend_API = import.meta.env.VITE_API_URL;

const SearchBox = () => {
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [categories, setCategories] = useState([]);

  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchCategory = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`${backend_API}/category/getAllCategory`);
      console.log(response.data, 'cate search')
      setCategories(response.data.category);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast(error?.response?.data?.message)
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setSearch(value);

    if (value.trim()) {
      // Optimized filtering: Suggest based on category name
      const filteredSuggestions = categories.filter((item) =>
        item.categoryName.toLowerCase().includes(value.toLowerCase())
      ).slice(0, 10); // Limit suggestions to top 10
      setSuggestions(filteredSuggestions);
    } else {
      setSuggestions([]); // Clear suggestions when input is empty
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/serviceDetail`, { state: search });
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setSearch(suggestion);
    navigate(`/serviceDetail`, { state: suggestion });
  };

  // Fetch categories only once when the component is mounted
  useEffect(() => {
    fetchCategory();
  }, []);

  return (
    <form onSubmit={handleSubmit} className="w-100" style={{ position: 'relative' }}>
      <div className="search-input border rounded-1 ps-3 pe-2 d-flex align-items-center">
        <input
          type="text"
          value={search}
          onChange={handleInputChange}
          className="grow outline-none bg-base-100 py-2"
          placeholder="Search service"
        />
        <button type="submit" className="p-1 rounded-1 btn-sm text-white bg-orange">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="h-5 w-5 opacity-100">
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </button>
      </div>

      {suggestions.length > 0 && (
        <ul
          className="rounded-2"
          style={{
            position: 'absolute',
            top: '50px',
            width: '100%',
            background: '#fff',
            border: '1px solid #ccc',
          }}
        >
          {suggestions.map((suggestion, index) => (
            <li
              key={index}
              onClick={() => handleSuggestionClick(suggestion.categoryName)}
              style={{
                padding: '8px',
                cursor: 'pointer',
              }}
              className="hover:bg-red-200"
            >
              {suggestion.categoryName}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default SearchBox;
