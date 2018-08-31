import { apiCall } from '../../services/api';
import { addError } from './errors';

export function uploadLocalFile(type, path, file){
  return dispatch => {
		return new Promise((resolve,reject) => {
      const formData = new FormData();
      formData.append('productcsv', file, file.filename);
			return apiCall(type, path, formData)
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
