import ShowContactMessages from '../ShowContactMessages';

const ListContactMessages = ({ messages }) => {
  let showMessages = '';
  if (messages.length > 0) {
    showMessages = messages.map((message, index) => {
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
