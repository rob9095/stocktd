const csvtojson=require("csvtojson");

export const parseCSV = (event) => {
  return dispatch => {
    return new Promise((resolve,reject) => {
      // Check for File API support.
      if (!window.FileReader) {
        reject('file reader not supported in browser')
        return
      }
      if (!event.target.files[0].name.endsWith('.csv')) {
        reject('not a csv')
        return
      }
      const reader = new FileReader();
      reader.readAsText(event.target.files[0]);
      reader.onload = async (e) => {
        let json = await csvtojson().fromString(e.target.result);
        resolve(json)
      }
      reader.onerror = (err) => {
        reject(err)
      }
    })
  }
}
