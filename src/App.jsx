import { useState, useEffect } from 'react'
import './App.css'
import data from './data.json'

function App() {

  const [jobs, setJobs] = useState(data)

  const [windowWidth, setWindowWidth] = useState(window.innerWidth)

  useEffect(() => {
    // Function to update window width
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    // Add event listener to track window resize
    window.addEventListener("resize", handleResize);

    // Clean up event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty array ensures effect runs only on mount/unmount


  const [filters, setFilters] = useState([])

  //  Function to filter jobs based on filters
  useEffect(() => {
    const filteredJobs = data.filter((job) => {
      const tags = [job.role, job.level, ...(job.tools || []), ...(job.languages || [])]
      return filters.every((filter) => tags.includes(filter))
    })
    setJobs(filteredJobs)
  }, [filters])

  const addFilter = (filter) => {
    setFilters((prev) => {
      if (prev.includes(filter)) {
        return prev
      }
      return [...prev, filter]
    })
  }


  const handleRemoveFilter = (filter) => {
    setFilters((prev) => {
      return prev.filter((item) => item !== filter)
    })
  }


  return (
    <div className='app'>
      <header className={windowWidth <= 768 ? "mobile-header" : "desktop-header"}></header>
      {filters.length > 0 && <div className="filter-box">
          {filters.map((filter, index) => {
            return (
              <div className='filter-tag-container' key={index}>
                <div className='filter-tag'>
                  {filter}
                </div>
                <div className="remove-filter" onClick={() => handleRemoveFilter(filter)}>
                  &#10006;
                </div>
              </div>
            )
          })}
        </div>}
      <div className="job-listings-container">
        {jobs.map((job) => {
          return (
            <div className="job-listing" key={job.id}>
              <div className="job-listing-details">
                <div className="job-listing-logo">
                  <img src={job.logo} alt="Job Company Logo" />
                </div>
                <div className="job-listing-info">
                  <div className="job-listing-company">
                    <h4>{job.company}</h4>
                    {job.new && <span className="new">New!</span>}
                    {job.featured && <span className="featured">Featured</span>}
                  </div>
                  <h2>{job.position}</h2>
                  <div className="job-listing-meta">
                    <span>{job.postedAt}</span>
                    <span>{job.contract}</span>
                    <span>{job.location}</span>
                  </div>
                </div>
              </div>
              <hr />
              <div className="job-listing-tags">
              {[...[job.role], ...[job.level], ...(job.tools || []), ...(job.languages || [])
                ].map((tag, index) => (
                  <div className="tag" key={index} onClick={() => addFilter(tag)}>
                    {tag}
                  </div>
                ))}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}

export default App
