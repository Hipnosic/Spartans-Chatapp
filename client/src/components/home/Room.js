import React from 'react'
const Room = ({ name }) => {
    return (

        <div className="card horizontal">

            <div className="card-stacked">
                <div className="card-content">
                    <p>{name}</p>
                    <button class="btn">Remove room</button>
                </div>

            </div>
        </div>

    )
}

export default Room
