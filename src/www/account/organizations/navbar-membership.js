module.exports = {
  setup: (doc, organization, account) => {
    if (organization.ownerid !== account.accountid) {
      const template = doc.getElementById('navbar')
      const revokeLink = template.getElementById('navbar-revoke-link')
      if (revokeLink && revokeLink.parentNode) {
        revokeLink.parentNode.removeChild(revokeLink)
      }
    }
  }
}
