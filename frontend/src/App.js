import './App.css';
import { IconButton, Pagination } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState} from "react";
import axios from "axios";

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [tweetList, setTweetList] = useState([]);
  const [page, setPage] = useState(1);
  const [curPage, setCurPage] = useState([]);
  const listLenPerPage = 10;
  useEffect(()=>{
    handlePagination()
  } ,[tweetList,page])

  const handlePagination = () => {
    var start = (page-1)*listLenPerPage
    var end = Math.min(page*listLenPerPage, tweetList.length)
    setCurPage(tweetList.slice(start, end))
  }

  const handleSearch = () => {
    if (searchInput.length === 0) {
      setTweetList([]);
    } else {
      axios.get('/query', { params: { query: searchInput } }).then(
        res => {
          setTweetList(res.data[0].data);
          handlePagination();
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
      {tweetList && curPage && curPage.map(tweet => {
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
          {tweetList.length>0 && <Pagination count={Math.ceil(tweetList.length/listLenPerPage)} onChange={(e, value) => setPage(value)} />}
      </div>
    </div>
  );
}

export default App;
