import { apiCall } from '../../services/api';
import { addError } from './errors';

export function fetchAllProducts(company){
  return dispatch => {
		return new Promise((resolve,reject) => {
			return apiCall('post', `/api/products/`, {company})
			.then((res) => {
				resolve(res);
			})
			.catch(err => {
				dispatch(addError(err.message));
				reject();
			})
		});
	}
}
