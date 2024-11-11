import React, { useState } from "react"
import Homes from "../components/homes/Homes"
import Trending from "../components/trending/Trending"
import Upcomming from "../components/upcoming/Upcomming"
import Community from "../components/community/Community"
import { latest, recommended, upcome,docter,posts } from "../dummyData"

const HomePage = () => {
  const [items] = useState(upcome)
  const [item] = useState(latest)
  const [rec] = useState(recommended)
  const [doc] = useState(docter)
  const [post] = useState(posts)
  
  
  return (
    <>
      <Homes />
      <Upcomming items={items} title='โหมดจำลอง' />
      <Upcomming items={item} title='บทความ' />
      <Trending />
      <Community items={{ doc, post }} title="ชุมชน" />
    </>
  )
}

export default HomePage
