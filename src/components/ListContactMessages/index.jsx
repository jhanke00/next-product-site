import { useEffect, useState } from 'react';
import ShowContactMessages from '../ShowContactMessages';

const ListContactMessages = () => {
  let [messageList, serMessageList] = useState([]);

  useEffect(() => {
    let messages = JSON.parse(localStorage.getItem('messages')) || [];
    serMessageList(messages);
  }, []);

  let showMessages = '';
  if (messageList && messageList.length > 0) {
    showMessages = messageList
      .sort()
      .reverse()
      .map((message, index) => {
        return <ShowContactMessages key={index} message={message} />;
      });
  } else {
    showMessages = <div className='no-message'>No user message found.</div>;
  }

  return (
    <div className='message-list'>
      <h3>User messages</h3>
      <div>{showMessages}</div>
    </div>
  );
};
export default ListContactMessages;
