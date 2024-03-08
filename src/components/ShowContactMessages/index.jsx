const ShowContactMessages = ({ message }) => {
  return (
    <div className='message'>
      <div>
        <label>Name: </label>
        {message.name}
      </div>
      <div>
        <label>Email:</label>
        {message.email}
      </div>
      <div>
        <label>Subject:</label>
        {message.subject}
      </div>
      <div>
        <label>Message:</label>
        {message.message}
      </div>
    </div>
  );
};
export default ShowContactMessages;
