import Card from '../card';

export default function alert({ type, title, description }) {
  return (
    <Card className={`text center alert alert-${type}`}>
      <h3>{title}</h3>
      <p>{description}</p>
    </Card>
  );
}
