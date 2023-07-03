import { useState, useEffect } from 'react'
import Api from '../../../../../api'

export default function useList(props) {
  const [message, setMessage] = useState(
    process.env.REACT_APP_MODE === 'dev' ? '徐同保' : ''
  )
  const [total, setTotal] = useState(0)
  const [current, setCurrent] = useState(1)
  const [list, setList] = useState([])
  const [searchInformation, setSearchInformation] = useState({})

  const handleChange = (e) => {
    setMessage(e.target.value)
  }

  const handleSearch = (value, e, pageNum = 1) => {
    console.log('search', value, e)

    if (value) {
      Api.h5
        .chatGoogleSearch({
          message,
          pageNum,
        })
        .then((res) => {
          if (res.code === 200) {
            if (res.data?.searchResult) {
              const { items, searchInformation } = res.data?.searchResult
              if (Array.isArray(items) && items.length > 0) {
                items.forEach((item) => {
                  item.breadcrumbList = []
                  let url = item.link
                  url = url.slice(url.indexOf('/') + 2)
                  if (url) {
                   let urlArr = url.split('/')
                   item.breadcrumbList = urlArr.slice(0, urlArr.length - 1).map(item => {
                    return {
                      title: decodeURIComponent(item)
                    }
                   })
                  }
                  item.breadcrumbList
                    .map((breadcrumbListItem) => {
                      if (breadcrumbListItem !== '...') {
                        return {
                          title: breadcrumbListItem,
                        }
                      } else {
                        return false
                      }
                    })
                    .filter((breadcrumbListItem) => breadcrumbListItem)
                })

                setList(items)
                setSearchInformation(searchInformation)
                if (searchInformation && searchInformation.totalResults > 0) {
                  let total = searchInformation.totalResults - 0
                  total = total > 100 ? 100 : total
                  setTotal(total)
                } else {
                  setTotal(0)
                }
                if (pageNum > 0) {
                  setCurrent(pageNum)
                } else {
                  setCurrent(1)
                }
              } else {
                setList([])
                setSearchInformation({})
                setTotal(0)
              }
            } else {
              setList([])
              setSearchInformation({})
              setTotal(0)
            }
          }
        })
    } else {
      // setList([])
      // setSearchInformation({})
    }
  }

  const handlePageChange = ({ pageNum = 1 }) => {
    handleSearch(message, {}, pageNum)
  }

  useEffect(() => {
    // eslint-disable-next-line
  }, [])

  return {
    message,
    list,
    searchInformation,
    total,
    current,
    handleChange,
    handleSearch,
    handlePageChange,
  }
}
