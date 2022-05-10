import './App.css';
import { IconButton, Pagination } from "@mui/material";
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState} from "react";
import ReactEcharts from 'echarts-for-react'
import axios from "axios";

function App() {
  const getOption = ()=> {
    let option = {
        title: {
            text: 'Sentiment Analysis Result',
            x: 'center'
        },
        tooltip : {
            trigger: 'item',
            //提示框浮层内容格式器，支持字符串模板和回调函数形式。
            formatter: "{a} <br/>{b} : {c} ({d}%)" 
        },
        legend: {
            orient: 'vertical',
            top: 20,
            right: 5,
            data: ['Positive','Neutral','Negative']
        },
        series : [
            {
                name:'Percentage',
                type:'pie',
                data:[
                    {value:positivePercentage, name:'Positive'},
                    {value:neutralPercentage, name:'Neutral'},
                    {value:negativePercentage, name:'Negative'}
                ],
            }
        ]
    }
    return option;
  } 
  const [searchInput, setSearchInput] = useState('');
  const [tweetList, setTweetList] = useState([]);
  const [page, setPage] = useState(1);
  const [curPage, setCurPage] = useState([]);
  const listLenPerPage = 10;
  const [positivePercentage, setPositivePercentage] = useState(0);
  const [neutralPercentage, setNeutralPercentage] = useState(0);
  const [negativePercentage, setNegativePercentage] = useState(0);
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
          const total = res.data[1].sentiment.total*1.0;
          setNegativePercentage(res.data[1].sentiment.negative/total)
          setPositivePercentage(res.data[1].sentiment.positive/total)
          setNeutralPercentage(res.data[1].sentiment.neutral/total)
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
      {curPage.length>0 && <ReactEcharts option={getOption()}/>}
    </div>
  );
}

export default App;
