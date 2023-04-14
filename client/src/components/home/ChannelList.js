import React from 'react';
import Channel from './Channel';
const ChannelList = ({ channels, handleRemove }) => {
    return (
        <div>
            {channels && channels.map(channel => (
                  <Channel key={channel._id} name={channel.name} handleRemove={handleRemove} channelId={channel._id} channelName={channel.name} />
            ))}
        </div>
    )
}

export default ChannelList
