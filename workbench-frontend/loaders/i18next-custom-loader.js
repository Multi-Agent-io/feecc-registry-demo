module.exports = function (source) {
  let parse = JSON.parse(source.substr(17, source.length))
  let initObject = [{}]
  parse.map((item, index) => {
    if (index !== parse.length -1 ) {
      let languages = Object.keys(item).filter((v) => v!== 'key')
      let key = Object.keys(item).filter((v) => v === 'key')[0]
      languages.map((item_low, index_low) => {
        let pair = { [item[key]]: item[item_low] }
        initObject[index_low] = Object.assign({}, initObject[index_low], pair)
      })
    }
  })
  return 'module.exports = ' + JSON.stringify(initObject)
}
