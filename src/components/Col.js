import PropTypes from 'prop-types';
import styled from 'styled-components';
import isInteger from 'lodash.isinteger';
import isNumber from 'is-number';

import config, { DIMENSION_NAMES } from '../config';

const ModificatorType = PropTypes.oneOfType([PropTypes.number, PropTypes.bool]);

const offsetProps = DIMENSION_NAMES.map(d => d + 'Offset');
const DimensionPropTypes = DIMENSION_NAMES.reduce((propTypes, dimension) => {
  propTypes[dimension] = ModificatorType;
  propTypes[dimension + 'Offset'] = PropTypes.number;
  return propTypes;
}, {});

const Col = styled.div`
  box-sizing: border-box;
  flex: 0 0 auto;
  padding-right: ${p => config(p).gutterWidth / 2}rem;
  padding-left: ${p => config(p).gutterWidth / 2}rem;
  display: block;

  ${p => (p.flex ? `display: flex;` : '')};

  ${p => p.reverse && `flex-direction: column-reverse;`};

  ${p =>
    Object.keys(p)
      .filter(k => DIMENSION_NAMES.indexOf(k) !== -1)
      .sort(
        (k1, k2) => DIMENSION_NAMES.indexOf(k1) - DIMENSION_NAMES.indexOf(k2)
      )
      .map(k => {
        const pk = isNumber(p[k]) ? Number(p[k]) : p[k];

        return config(p).media[k]`
      ${isInteger(pk) ? `
        flex-basis: ${100 / config(p).gridSize * p[k]}%;
        max-width: ${100 / config(p).gridSize * p[k]}%;
      ` : Boolean(p[k]) ? `
        flex-grow: 1;
        flex-basis: 0;
        max-width: 100%;
      ` : 'display: none;'}
    `;
      })} ${p =>
    Object.keys(p)
      .filter(k => offsetProps.indexOf(k) !== -1)
      .map(
        k => config(p).media[k.replace(/Offset$/, '')]`
    margin-left: ${100 / config(p).gridSize * p[k]}%;
  `
      )};
`;

Col.displayName = 'Col';

Col.propTypes = {
  ...DimensionPropTypes,
  reverse: PropTypes.bool,
  children: PropTypes.node
};

export default Col;
