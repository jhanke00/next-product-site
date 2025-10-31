export default function GraphQLPlaygroundPage() {
  return (
    <div className='p-6 space-y-4'>
      <h1 className='text-2xl font-semibold'>GraphQL Playground</h1>
      <p className='text-sm text-gray-600'>
        Interact with the GraphQL API. This embeds GraphiQL from <code>/api/graphql</code>.
      </p>
      <div className='border rounded-md overflow-hidden' style={{ height: '70vh' }}>
        <iframe title='GraphiQL' src='/api/graphql' style={{ width: '100%', height: '100%', border: '0' }} />
      </div>
      <p className='text-sm text-gray-600'>
        See <code>/docs/graphql.md</code> for schema and examples.
      </p>
    </div>
  );
}
