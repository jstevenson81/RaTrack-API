import {IAuth0Options} from '../interfaces';

const auth0Options: IAuth0Options = {
  audience: 'https://api.ratracker.com',
  issuer: 'https://ratracker.auth0.com/',
  algorithm: 'RS256'
}

export default auth0Options;