import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from '../assets/Components/Header'
import Footer from '../assets/Components/Footer'

function AppLayout() {
  return (
    <>
    <Header/>
     <Outlet/>
     <Footer/>
    </>
  )
}

export default AppLayout
