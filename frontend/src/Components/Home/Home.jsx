import React from 'react'
import Genres from '../Genres/Genres'
import Post from '../Post/Post'
import Account from '../Account/Account'

const Home = ({ loggedIn, loggedInUser }) => {
  return (
    <div className='flex justify-between'>
      <div>
        <Genres />
      </div>
      <div>
        <Post loggedInUser={loggedInUser} />
      </div>
      {loggedIn ? (
        <>
          <Account />
          
        </>
      ) : (
        <p>Hello, Please Log in</p>
      )}
    </div>
  )
}

export default Home
