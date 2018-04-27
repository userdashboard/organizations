module.exports = {
  render: renderNavigation
}

async function renderNavigation (req, doc) {
  const template = doc.getElementById('navbar-template')
  const children = template.child.length
  doc.renderTemplate(req.query, template, template)
  template.child.splice(0, children)
}
