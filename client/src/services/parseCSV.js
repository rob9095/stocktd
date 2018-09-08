import { addError } from '../store/actions/errors';
const csvtojson=require("csvtojson");

export const parseCSV = (event) => {
  return dispatch => {
    return new Promise((resolve,reject) => {
      // Check for File API support.
      if (!window.FileReader) {
        reject('file reader not supported in browser')
        dispatch(addError(['File reader not supported in browser']))
      }
      if (!event.target.files[0].name.endsWith('.csv')) {
        reject('not a csv')
        dispatch(addError(['The imported file was not a .csv']))
      }
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = async (e) => {
        let raw = await csvtojson().fromString(e.target.result)
        let json = raw.map((po)=>(Object.keys(po).reduce((c, k) => (c[k.toLowerCase()] = po[k], c), {})))
        let jsonLowerCase = await csvtojson().fromString(e.target.result.toLowerCase())
        resolve({json, jsonLowerCase})
      }
      reader.onerror = (err) => {
        addError(err)
        reject(err)
      }
    })
  }
}
