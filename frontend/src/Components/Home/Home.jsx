import React from 'react'
import Genres from '../Genres/Genres'
import Post from '../Post/Post'
import Account from '../Account/Account'

const Home = ({ loggedIn }) => {
  return (
    <div className='flex justify-between'>
      <div>
        <Genres />
      </div>
      <div>
        <Post />
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
