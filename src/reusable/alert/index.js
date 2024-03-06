//propTypes to be added for Javacript

import Card from '../card';

import './alert.css';

export default function alert({ type = '', title = '', description = '' }) {
  return (
    <Card className={`text-center reusable-alert alert alert-${type}`}>
      <h3 className='label-l- mb-2'>{title}</h3>
      <p className='label-m'>{description}</p>
    </Card>
  );
}
