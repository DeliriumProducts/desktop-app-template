import withAuth from '../hocs/withAuth';

function Protected() {
  return <div>secret page..</div>;
}

export default withAuth(Protected);
