export function success(resources, meta = {}) {
  return { data: resources, ...meta }
}

export function error({ status, code }, description = 'missing', fields = undefined) {
  return {
    err: {
      status,
      code,
      description,
      fields,
    },
  }
}
