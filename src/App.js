import { useEffect, useState } from "react";
import "./App.css";
import { defaultList } from "./constants";

const App = () => {
  const [list, setList] = useState(defaultList);

  const [searchQuery, setSearchQuery] = useState(null);

  const [data, setData] = useState();

  useEffect(() => {
    const interval = setInterval(() => {
      updateList();
    }, 2000);

    return () => clearInterval(interval);
  }, [data]);

  useEffect(() => {
    if (searchQuery) {
      getSong();
    }
  }, [searchQuery]);

  const updateList = () => {
    setList((prevState) => {
      const previousState = [...prevState];

      if (data && data.length > 0) {
        const temp = [...data];
        const firstElement = temp.shift();
        setData(temp);
        previousState.shift();
        previousState.push(firstElement);
        return previousState;
      } else {
        const firstElement = previousState.shift();
        previousState.push(firstElement);
        return previousState;
      }
    });
  };

  const getSong = async () => {
    try {
      const response = await fetch(
        `https://itunes.apple.com/search?term=${searchQuery}`
      );

      const { results } = await response.json();

      if (results) {
        const collections = results
          .map((item) => item.collectionName)
          .sort()
          .slice(0, 5);
        setData(collections);
      } else throw new Error("Unable to fetch list");
    } catch (error) {
      alert(error.message || "Unable to fetch list");
    }
  };

  return (
    <div className="App">
      <input
        type="text"
        placeholder="search song"
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
      />

      <ul>
        {list.map((item) => (
          <li>{item}</li>
        ))}
      </ul>
    </div>
  );
};

export default App;
