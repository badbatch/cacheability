const { consts, loadRepositoryConfig } = require('@repodog/config-helpers');

const { REACT } = consts;
const { features } = loadRepositoryConfig();

if (features.includes(REACT)) {
  const Enzyme = require('enzyme'); // eslint-disable-line
  const Adapter = require('enzyme-adapter-react-16'); // eslint-disable-line
  Enzyme.configure({ adapter: new Adapter() });
}
