import React from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import AppLayout from './Layout/AppLayout'
import Home from './Layout/Pages/Home'
import ReceiverPage from './Layout/Pages/ReceiverPage'
import QRSharePage from './Layout/Pages/QRSharePage'
import FeaturePage from './Layout/Pages/FeaturePage'

import RoomDashboard from './Layout/Pages/RoomDashboard'

function App() {
  const router = createBrowserRouter([{
path:"/",
element:<AppLayout/>,
children:[
  {
    path:"/",
    element:<Home/>
  },

  {
    path:"/RoomDashboard/:roomnum",
    element:<RoomDashboard/>
  },
  {
    path:"/ReceiverPage/:inputCode",
    element:<ReceiverPage/>
  },
  {
    path:"/QRSharePage",
    element:<QRSharePage/>
  },
  {
    path:"/FeaturePage",
    element:<FeaturePage/>
  },
]
  }])
  return <RouterProvider router={router}></RouterProvider>
}

export default App
