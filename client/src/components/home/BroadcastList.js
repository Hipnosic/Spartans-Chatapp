import React from 'react';
const BroadcastList = ({ broadcasts }) => {
    return (
        <div>
            { broadcasts && <ul>
                  {broadcasts.map((broadcast) => {
                        return <li>{broadcast.message}</li>
                  })}
            </ul>
            }
        </div>
    )
}

export default BroadcastList
