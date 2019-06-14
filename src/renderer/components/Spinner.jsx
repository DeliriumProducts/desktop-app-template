import { Spin, Icon } from 'antd';

const Spinner = () => (
  <Spin indicator={<Icon style={{ color: '#000' }} type="loading" spin />} />
);

export default Spinner;
