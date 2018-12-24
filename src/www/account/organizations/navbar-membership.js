module.exports = {
  setup: (doc, req) => {
    // revoking invitations can only be done by owners
    if (req.data.organization.ownerid !== req.account.accountid) {
      const template = doc.getElementById('navbar')
      const revokeLink = template.getElementById('navbar-revoke-link')
      if (revokeLink && revokeLink.parentNode) {
        revokeLink.parentNode.removeChild(revokeLink)
      }
    }
  }
}
