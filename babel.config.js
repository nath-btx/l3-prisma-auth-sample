module.exports = api => {
  api.cache(true)

  const presets = ['@babel/env']

  return {
    presets,
  }
}
