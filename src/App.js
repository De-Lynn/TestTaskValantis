import { useEffect, useState } from 'react';
import './App.css';
import md5 from 'md5';
import SearchForm from './SeachForm';
import GoodsList from './GoodsList';
import PageNumber from './PageNumber';
import ControlButton from './ControlButton';

function App() {
  const currentDate = new Date()
  let day = currentDate.getDate()
  if (day < 10) day = '0' + day
  let month = currentDate.getMonth() + 1
  if (month < 10) month = '0' + month
  let year = currentDate.getFullYear()
  
  const BASE_URL = 'https://api.valantis.store:41000'
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "*",
    "Access-Control-Allow-Credentials": true,
    "Content-Type": "application/json;charset=utf-8",
    "X-Auth": md5(`Valantis_${year}${month}${day}`)
  }

  const [isLoading, setIsLoading] = useState(false)

  const [ids, setIds] = useState([])
  const [goods, setGoods] = useState([])
  const [pagesCount, setPagesCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [itemsPerPage, setItemsOnPage] = useState(50)
  
  // --------- FETCHING IDS ---------
  useEffect(() => {
    const fetchIds = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(`${BASE_URL}`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({
            "action": "get_ids",
            "params": {"offset": 0, "limit": 625}
          })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`${res.status}`)
          }
          return res.json()
        })

        const ids = response.result
        setIds(ids)
      } catch (error) {
        console.log(error)
        if (error.message === '500') {
          fetchIds()
        }
        setIsLoading(false)
      }
    }
    fetchIds()

  }, [])

  // --------- FETCHING ITEMS ---------
  useEffect(() => {
    const fetchGoods = async () => {

      try {
        const response = await fetch(`${BASE_URL}`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify({
            "action": "get_items",
            "params": {"ids": ids}
          })
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`${res.status}, ${res.statusText}`)
          }
          return res.json()
        })
        
        const goods = response.result.reduce((acc, item) => {
          if (acc.map[item.id]) return acc
  
          acc.map[item.id] = true
          acc.goods.push(item)
          return acc
        }, {map: {}, goods: []}).goods
        setGoods(goods)

        const pagesCount = Math.ceil(goods.length / 50)
        setPagesCount(pagesCount)
        if (pagesCount === 1) setIsShowingMore(true)

        setCurrentPage(1)
      } catch (error) {
        console.log(error)
      } finally {
        setIsLoading(false)
      }
    }
    if (ids.length) fetchGoods()
  }, [ids])

  // --------- FILTER FORM ---------
  const [filterReqBody, setFilterReqBody] = useState({})

  const onFormSubmit = (e) => {
    e.preventDefault()
    const formData = new FormData(e.target)
    const param = formData.get("param").toLowerCase()
    let value = formData.get("value")
    if (param === "price") value = Number(value)
    const filterReqBody = {
      "action": "filter",
      "params": {}
    }
    filterReqBody["params"][param] = value
    setFilterReqBody(filterReqBody)
  }

  // --------- FILTER REQUEST ---------
  useEffect(() => {
    const fetchIds = async () => {
      setIsLoading(true)

      try {
        const response = await fetch(`${BASE_URL}`, {
          headers: headers,
          method: "POST",
          body: JSON.stringify(filterReqBody)
        })
        .then(res => {
          if (!res.ok) {
            throw new Error(`${res.status}`)
          }
          return res.json()
        })
        
        const ids = response.result
        setIds(ids)
      } catch (error) {
        console.log(error)
        if (error.message === '500') {
          fetchIds()
        }
        setIsLoading(false)
      }
    }
    if (Object.keys(filterReqBody).length) fetchIds()
  }, [filterReqBody])


  // --------- PAGINATION ---------
  const onPageClick = (e) => {
    setCurrentPage(Number(e.target.textContent))
  }

  const [isShowingMore, setIsShowingMore] = useState(false)

  const onNextClick = () => {
    setCurrentPage(currentPage + 1)
  }
  const onPrevClick = () => {
    setCurrentPage(currentPage - 1)
  }
  const onShowMoreClick = () => {
    setIsShowingMore(true)
  }

  const onUpClick = () => {
    window.scrollTo(0,0)
  }
  
  return (
    <div className="app">
      
      {/* Search Form */}
      <SearchForm onFormSubmit={onFormSubmit}/>

      {isLoading && <div>Loading...</div>}

      <div className='app__results'>

        {/* Pages Controls */}
        {!isShowingMore && <div className='results__pages'>
            {currentPage !== 1 && <ControlButton onClick={onPrevClick} text={'Prev'}/>}
            <ControlButton onClick={onShowMoreClick} text={'...'} className='pages__number'/>
            {currentPage !== pagesCount && <ControlButton onClick={onNextClick} text={'Next'}/>}
          </div>
        }
        {isShowingMore && <div className='results__pages'>
            {currentPage !== 1 && <ControlButton onClick={onPrevClick} text={'Prev'}/>}
            {
              [...Array(pagesCount)].map((item, index) => {

                // show page number 
                if ((index + 1) === 1 || (index + 1) === pagesCount)
                  return <PageNumber currentPage={currentPage} index={index} onPageClick={onPageClick}/>
                if ((currentPage - 2 <= index + 1) && (index + 1 <= currentPage + 2))
                  return <PageNumber currentPage={currentPage} index={index} onPageClick={onPageClick}/>

                // show ...
                if ((1 < index + 1) && (index + 1 === currentPage - 3) || (index + 1 < pagesCount) && (index + 1 === currentPage + 3)) 
                  return <span className='pages__number'>...</span>
                  
              })
            }
            {currentPage !== pagesCount && <ControlButton onClick={onNextClick} text={'Next'}/>}
          </div> 
        }

        {/* Results */}
        <GoodsList goods={goods} currentPage={currentPage} itemsPerPage={itemsPerPage}/>
        
        <button className='results__button button__up'  onClick={onUpClick}>UP</button>
      </div>
    </div>
  );
}

export default App;
