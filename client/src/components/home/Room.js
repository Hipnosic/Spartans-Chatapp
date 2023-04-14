import React from 'react'
import { Link } from 'react-router-dom';

const Room = ({ name, handleRemove, roomId, roomName }) => {

      function handleClick() {
            handleRemove(roomName, roomId);
      }

    return (

        <div className="card horizontal">

            <div className="card-stacked">
                <div className="card-content">
                    <p>{name}</p>
                    <button className="btn btn-outline-danger" onClick={handleClick}>Remove room</button>
                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3">
                    <Link to={'/chat/' + roomId + '/' + roomName} key={roomId} >Gå in i rum</Link>
                    </button>
                </div>

            </div>
        </div>

    )
}

export default Room
