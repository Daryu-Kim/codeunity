import { useState } from "react";
import {
  getFirestore,
  collection,
  query,
  where,
  getDocs,
} from "firebase/firestore";

const MainSearch = () => {
  const [query, setQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearch = async (event) => {
    event.preventDefault();

    const db = getFirestore();
    const q = query(collection(db, "Users"), where("name", "==", query));
    const querySnapshot = await getDocs(q);
    const results = querySnapshot.docs.map((doc) => doc.data());
    setSearchResults(results);
  };

  return (
    <div>
      <form onSubmit={handleSearch}>
        <input type="text" value={query} onChange={handleInputChange} />
        <button type="submit">Search</button>
      </form>
      {searchResults.length > 0 ? (
        <ul>
          {searchResults.map((user) => (
            <li key={user.uid}>{user.name}</li>
          ))}
        </ul>
      ) : (
        <p>No results found</p>
      )}
    </div>
  );
};
export default MainSearch;
