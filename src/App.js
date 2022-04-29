import './App.css';
import { IconButton, Pagination } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useState} from "react";

function App() {
  const [searchInput, setSearchInput] = useState('');
  const [tweetList, setTweetList] = useState(["Native American communities have been hit hard by COVID-19. But thanks to the Indian Health Service and strong partnerships with Tribal governments, organizations, and urban Indian groups, more than 500,000 vaccines have already been administered with more on the way.","ALERT: CVS Pharmacy is now offering COVID-19 vaccines in Massachusetts to Teachers K-12, Daycare and preschool workers, and staff. https://t.co/pBRXCSpHmL"]);
  const [page, setPage] = useState(0);

  const handleSearch = () => {
    console.log(searchInput)
    if (searchInput.length === 0) {
      setTweetList([]);
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
                      <div>{tweet}</div>
                  </div>
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
