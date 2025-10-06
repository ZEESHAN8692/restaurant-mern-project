import React from 'react'
import Hero from './Hero'
import ProductList from './ProductList'
import Location from '../components/Location'

import BookTable from '../components/BookTable'
import PublicShop from './PublicShop'
import InfoText from './InfoText'

function Home() {
  return (
    <>
    <Hero/>
    <InfoText/>
    {/* <ProductList/> */}
    <PublicShop/>
    <BookTable/>
    <Location/>
    </>
  )
}

export default Home