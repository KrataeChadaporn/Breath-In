import React, { useState } from "react"
import Homes from "../components/homes/Homes"
import Trending from "../components/trending/Trending"
import Upcomming from "../components/upcoming/Upcomming"
import { latest, recommended, upcome } from "../dummyData"

const HomePage = () => {
  const [items] = useState(upcome)
  const [item] = useState(latest)
  const [rec] = useState(recommended)
  
  return (
    <>
      <Homes />
      <Upcomming items={items} title='โหมดจำลอง' />
      <Upcomming items={item} title='บทความ' />
      <Trending />
      <Upcomming items={rec} title='ชุมชน' />
    </>
  )
}

export default HomePage
