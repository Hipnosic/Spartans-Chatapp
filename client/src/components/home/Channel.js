import React from 'react'
import { Link } from 'react-router-dom';

const Channel = ({ name, handleRemove, channelId, channelName }) => {

      function handleClick() {
            handleRemove(channelName, channelId);
      }

    return (

        <div className="card horizontal">

            <div className="card-stacked">
                <div className="card-content">
                    <p>{name}</p>
                    <button className="btn btn-outline-danger mb-3" onClick={handleClick}>Remove channel</button>
                    <button className="btn btn-primary btn-block fa-lg gradient-custom-2 mb-3">
                    <Link to={'/chat/' + channelId + '/' + channelName} key={channelId}>Join Channel</Link>
                    </button>
                </div>

            </div>
        </div>

    )
}

export default Channel
