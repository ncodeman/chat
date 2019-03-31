exports.is_empty = str => {
  if (!str) return true
  return false
}

exports.html = str => {
  return String(str).replace(/&/g, '&amp;').replace(/</g, '&lt;')
    .replace(/>/g, '&gt;').replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}