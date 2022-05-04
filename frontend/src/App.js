import './App.css';
import { IconButton, Pagination } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState} from "react";
import axios from "axios";

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [tweetList, setTweetList] = useState([]);
  const [page, setPage] = useState(0);

  useEffect(()=>{
    tweetList.length && handleSearch()
  } ,[page])

  const handleSearch = () => {
    if (searchInput.length === 0) {
      setTweetList([]);
    } else {
      const obj = { "query": searchInput, "from": page * 10, "to": page*10 + 10 };
      axios.post('/query', obj).then(
        res => {
          setTweetList(res.data.data);
        }
      ).catch(err=>{
        console.log('!!!error',err)
      });
    }
  }
  
  return (
    <div className="main-search">
      <div className="searchbar">
          <input type="text" placeholder="Search for related tweets" className="searchInput" onChange={(e) => setSearchInput(e.target.value)} onKeyPress={e => { if (e.key === 'Enter') { handleSearch() } }} />
          <IconButton style={{ color: "#9d75e3" }} component="span" onClick={() => handleSearch()} >
              <SearchIcon fontSize="large" />
          </IconButton>
      </div>
      {tweetList && tweetList.map(tweet => {
          return (
              <div className="search-card">
                  <div className="search-description">
                      <div>{tweet.text}</div>
                  </div>
                  <div className='sentiment'> {tweet.sentiment} </div>
              </div>
          )
      })}
      <div className="pagination">
          {tweetList.length > 0 && <Pagination count={10} onChange={(e, value) => setPage(value - 1)} />}
      </div>
    </div>
  );
}

export default App;
